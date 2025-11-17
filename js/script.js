/* js/script.js */

// ===============================================
// Data awal 
// ===============================================
const summary = {
  totalProducts: 3,       // jumlah total produk
  totalSales: 85,         // total penjualan 
  totalRevenue: 12500000  // total pemasukan 
};

let products = [
  { id: 1, name: "Kopi Gayo", price: 25000, stock: 50 },
  { id: 2, name: "Teh Hitam", price: 18000, stock: 30 },
  { id: 3, name: "Coklat Aceh", price: 30000, stock: 20 }
];

// ===============================================
// Fungsi umum 
// ===============================================

// Notifikasi
function toast(message, timeout = 2200){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = message;
  t.style.display = 'block';
  t.style.opacity = '1';
  clearTimeout(t._h);
  t._h = setTimeout(()=> t.style.opacity = '0', timeout - 300);
  setTimeout(()=> t.style.display = 'none', timeout);
}

// Format angka ke mata uang Rupiah
function currency(v){
  return 'Rp ' + Number(v).toLocaleString('id-ID');
}

// ===============================================
// Render tampilan Dashboard
// ===============================================
function renderDashboard(){
  const tp = document.getElementById('totalProducts');
  const ts = document.getElementById('totalSales');
  const tr = document.getElementById('totalRevenue');

  // Update kotak ringkasan dashboard
  if(tp) tp.textContent = summary.totalProducts;
  if(ts) ts.textContent = summary.totalSales;
  if(tr) tr.textContent = currency(summary.totalRevenue);

  // Tabel produk terbaru
  const rb = document.getElementById('recentBody');
  if(rb){
    rb.innerHTML = '';
    products.slice(0,6).forEach((p,i)=>{
      const trElem = document.createElement('tr');
      trElem.innerHTML = `
        <td>${i+1}</td>
        <td>${p.name}</td>
        <td>${currency(p.price)}</td>
        <td>${p.stock}</td>`;
      rb.appendChild(trElem);
    });
  }
}

// ===============================================
// Render tabel daftar produk
// ===============================================
function renderProductsTable(){
  const tb = document.getElementById('productBody');
  if(!tb) return;

  tb.innerHTML = '';
  products.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${p.name}</td>
      <td>${currency(p.price)}</td>
      <td>${p.stock}</td>
      <td>
        <button class="action-btn" onclick="openModal('edit', ${p.id})" title="Edit">✏️</button>
        <button class="action-btn" onclick="confirmDelete(${p.id})" title="Delete">🗑️</button>
      </td>
    `;
    tb.appendChild(tr);
  });
}

// ===============================================
// CRUD Produk (Tambah / Edit / Hapus)
// ===============================================

function refreshAll(){
  renderDashboard();
  renderProductsTable();
}

// Konfirmasi hapus data produk
function confirmDelete(id){
  const p = products.find(x=>x.id===id);
  if(!p) return;

  if(confirm(`Hapus produk "${p.name}"?`)){
    products = products.filter(x=>x.id!==id);
    summary.totalProducts = products.length;
    toast('Produk dihapus');
    refreshAll();
  }
}

// Variabel modal
const modal = document.getElementById ? document.getElementById('modal') : null;
let modalMode = 'add';  // mode: add / edit
let editId = null;      // id produk yang sedang diedit

// Buka modal tambah/edit
function openModal(mode='add', id=null){
  if(!modal) return;

  modalMode = mode;
  editId = id;
  modal.setAttribute('aria-hidden','false');

  // kosongkan input
  document.getElementById('mName').value = '';
  document.getElementById('mPrice').value = '';
  document.getElementById('mStock').value = '';

  // judul modal
  document.getElementById('modalTitle').textContent = 
    mode === 'add' ? 'Tambah Produk' : 'Edit Produk';

  // jika mode edit, bisa isi input dengan data lama
  if(mode === 'edit' && id != null){
    const p = products.find(x=>x.id===id);
    if(p){
      document.getElementById('mName').value = p.name;
      document.getElementById('mPrice').value = p.price;
      document.getElementById('mStock').value = p.stock;
    }
  }

  // Save
  const saveBtn = document.getElementById('saveBtn');
  saveBtn.onclick = saveModal;
}

// Tutup modal
function closeModal(){
  if(!modal) return;
  modal.setAttribute('aria-hidden','true');
}

// Simpan data dari modal 
function saveModal(){
  const name = document.getElementById('mName').value.trim();
  const price = Number(document.getElementById('mPrice').value || 0);
  const stock = Number(document.getElementById('mStock').value || 0);

  // validasi sederhana
  if(!name){ toast('Nama wajib diisi'); return; }
  if(price < 0 || stock < 0){ toast('Harga / stok tidak valid'); return; }

  // proses tambah produk baru
  if(modalMode === 'add'){
    const newId = products.length ? Math.max(...products.map(p=>p.id))+1 : 1;
    products.push({ id: newId, name, price, stock });
    summary.totalProducts = products.length;
    toast('Produk ditambahkan');
  }
  
  // proses edit produk
  else if(modalMode === 'edit' && editId != null){
    products = products.map(p => p.id === editId ? { ...p, name, price, stock } : p);
    toast('Perubahan disimpan');
  }

  closeModal();
  refreshAll();
}

// ===============================================
// Inisialisasi halaman 
// ===============================================
document.addEventListener('DOMContentLoaded', () => {
  // Tutup modal jika klik area gelap
  if(modal){
    modal.addEventListener('click', (e)=>{
      if(e.target === modal) closeModal();
    });
    modal.setAttribute('aria-hidden','true');
  }

  // Render awal dashboard dan tabel
  refreshAll();
});
