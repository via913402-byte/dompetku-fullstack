import { computed, ref, unref } from 'vue'

// Simpan di web/src/composables/useSearch.js
//
// Mencari di semua kolom teks dan angka pada sebuah item, jadi tidak perlu tahu
// nama kolomnya. Kolom id dan waktu dibuat/diubah diabaikan agar tidak ikut cocok.
// `getExtra(item)` opsional: mengembalikan teks tambahan yang ikut dicari
// (misalnya nama kategori atau status "lunas").

const KOLOM_DIABAIKAN = /^(id|.*_id|.*Id|createdAt|updatedAt|created_at|updated_at)$/

function normalisasi(teks) {
  return String(teks)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function useSearch(items, getExtra) {
  const query = ref('')

  const kata = computed(() => normalisasi(query.value.trim()))

  // "Rp 50.000" atau "50,000" juga cocok dengan nominal 50000
  const angka = computed(() => {
    const bersih = kata.value.replace(/^rp/, '').replace(/[.,\s]/g, '')
    return /^\d+$/.test(bersih) ? bersih : ''
  })

  const aktif = computed(() => kata.value !== '')

  function teksItem(item) {
    const bagian = []
    for (const [kolom, nilai] of Object.entries(item || {})) {
      if (KOLOM_DIABAIKAN.test(kolom)) continue
      if (typeof nilai === 'string' || typeof nilai === 'number') bagian.push(nilai)
    }
    if (getExtra) {
      try {
        const tambahan = getExtra(item)
        if (tambahan) bagian.push(tambahan)
      } catch {
        /* teks tambahan gagal dibuat, cukup pakai kolom asli */
      }
    }
    return normalisasi(bagian.join(' '))
  }

  const hasil = computed(() => {
    const daftar = unref(items) || []
    if (!aktif.value) return daftar
    return daftar.filter((item) => {
      const teks = teksItem(item)
      return teks.includes(kata.value) || (angka.value && teks.includes(angka.value))
    })
  })

  function reset() {
    query.value = ''
  }

  return { query, hasil, aktif, reset }
}