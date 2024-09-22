// Array untuk menyimpan data customer
let dataCustomer = [];

// Load data dari localStorage saat halaman dimuat
window.onload = function () {
  loading();
  const storedData = localStorage.getItem("customerData");
  if (storedData) {
    dataCustomer = JSON.parse(storedData);
  }
};

// Fungsi untuk menampilkan loading bar
function loading() {
  const loadingBar = document.querySelector(".loading");
  loadingBar.style.width = "100%";
  loadingBar.style.transition = "width 1s";
  setTimeout(() => {
    loadingBar.style.width = "0%";
    loadingBar.style.removeProperty("transition");
  }, 1000);
}

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage(dataCustomer) {
  localStorage.setItem("customerData", JSON.stringify(dataCustomer));
}

// Fungsi untuk menampilkan section tertentu dan menyembunyikan yang lain
function showSection(sectionId) {
  // Sembunyikan semua section
  document.querySelectorAll(".container > div").forEach((div) => {
    div.style.display = "none";
  });

  // Tampilkan section yang dipilih
  const section = document.getElementById(sectionId);

  // Jika section yang dipilih adalah "tampilkanData", set display menjadi grid
  if (sectionId === "tampilkanData") {
    section.style.display = "grid";
  } else if (sectionId === "editCustomer" || sectionId === "cariCustomer") {
    section.style.display = "flex";
  } else {
    // Jika bukan, set display menjadi block
    section.style.display = "block";
  }
}

// Event listener untuk form penambahan customer
document
  .getElementById("customerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    let dataCustomer = getDataCustomerFromLocalStorage();

    // Membuat objek customer baru dari input form
    const customer = {
      id: parseInt(document.getElementById("idCustomer").value),
      nama: document.getElementById("nama").value,
      tanggal: document.getElementById("tanggal").value,
      otakOtak: parseFloat(document.getElementById("otakOtak").value),
      tahuBulat: parseFloat(document.getElementById("tahuBulat").value),
      sotong: parseFloat(document.getElementById("sotong").value),
    };

    // Cek apakah ID sudah ada
    if (dataCustomer.some((c) => c.id === customer.id)) {
      document.querySelector(".error").innerHTML =
        'ID sudah ada. Gunakan ID lain <i class="fa-solid fa-circle-exclamation"></i>';
      document.querySelector(".error").classList.add("active");
      setTimeout(() => {
        document.querySelector(".error").classList.remove("active");
      }, 2300);
      return;
    }

    // Tambahkan customer baru ke array dataCustomer
    dataCustomer.push(customer);

    // Simpan ke localStorage
    saveToLocalStorage(dataCustomer);

    // Tampilkan pesan sukses
    document.querySelector(".success").innerHTML =
      'Data berhasil ditambahkan <i class="fa-solid fa-circle-check"></i>';
    document.querySelector(".success").classList.add("active");
    setTimeout(() => {
      document.querySelector(".success").classList.remove("active");
    }, 2300);

    // Reset form
    this.reset();
  });

// Fungsi untuk mengambil data dari localStorage
function getDataCustomerFromLocalStorage() {
  const storedData = localStorage.getItem("customerData");
  return storedData ? JSON.parse(storedData) : []; // Jika tidak ada data, kembalikan array kosong
}

// Fungsi untuk menampilkan data dan rangking customer
function tampilkanData() {
  // Ambil data dari localStorage
  dataCustomer = getDataCustomerFromLocalStorage();

  // Ambil elemen div tempat data akan ditampilkan
  const isiDataDiv = document.querySelector(".isi-data");

  // Kosongkan isi sebelumnya
  isiDataDiv.innerHTML = "";

  // Jika tidak ada data di localStorage, tampilkan pesan dan keluar dari fungsi
  if (dataCustomer.length === 0) {
    document.getElementById("menu").style.display = "none";
    document.getElementById("tampilkanData").style.display = "grid";
    isiDataDiv.innerHTML = `<p><i class="fa-regular fa-folder-open"></i><br>Tidak ada data customer untuk ditampilkan.</p>`;
    return;
  }

  // Hitung total dan rata-rata pembelian, lalu urutkan berdasarkan rata-rata pembelian tertinggi
  const sortedData = dataCustomer
    .map((customer) => {
      const total = customer.otakOtak + customer.tahuBulat + customer.sotong;
      const rataRata = total / 3;
      return { ...customer, total, rataRata };
    })
    .sort((a, b) => b.rataRata - a.rataRata);

  // Buat tabel secara dinamis
  const table = document.createElement("table");
  table.id = "customerTable";

  // Buat thead secara dinamis
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = [
    "Rangking",
    "ID",
    "Nama",
    "Rata-rata Pembelian",
    "Total Pembelian",
    "Tanggal",
    "Aksi",
  ];

  headers.forEach((headerText) => {
    const th = document.createElement("th");
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Buat tbody secara dinamis
  const tbody = document.createElement("tbody");

  sortedData.forEach((customer, index) => {
    const row = document.createElement("tr");

    // Tambahkan data rangking, id, nama, rata-rata, total, tanggal, dan aksi hapus
    const cells = [
      index + 1,
      customer.id,
      customer.nama,
      customer.rataRata.toFixed(2),
      customer.total,
      customer.tanggal,
    ];

    cells.forEach((cellData) => {
      const td = document.createElement("td");
      td.textContent = cellData;
      row.appendChild(td);
    });

    // Tambahkan tombol aksi hapus
    const actionCell = document.createElement("td");
    const hapusButton = document.createElement("button");
    hapusButton.textContent = "Hapus";
    hapusButton.onclick = () => hapusCustomer(customer.id);
    actionCell.appendChild(hapusButton);
    row.appendChild(actionCell);

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  isiDataDiv.appendChild(table); // Tambahkan tabel ke dalam div isi-data
  showSection("tampilkanData");
}

// Fungsi untuk menghapus semua data
function hapusSemuaData() {
  if (localStorage.getItem("customerData")) {
    localStorage.removeItem("customerData");
    document.querySelector(
      ".isi-data"
    ).innerHTML = `<p><i class="fa-regular fa-folder-open"></i><br>Tidak ada data customer untuk ditampilkan.</p>`;
    document.querySelector(".success").innerHTML =
      'Data berhasil dihapus <i class="fa-solid fa-circle-check"></i>';
    document.querySelector(".success").classList.add("active");
    setTimeout(() => {
      document.querySelector(".success").classList.remove("active");
    }, 2300);
  } else {
    document.querySelector(
      ".isi-data"
    ).innerHTML = `<p><i class="fa-regular fa-folder-open"></i><br>Tidak ada data customer untuk dihapus.</p>`;
  }
}

// Fungsi untuk menghapus customer tertentu
function hapusCustomer(id) {
  // Ambil data terbaru dari localStorage
  let dataCustomer = getDataCustomerFromLocalStorage();

  // Filter customer yang tidak memiliki ID yang dihapus
  dataCustomer = dataCustomer.filter((customer) => customer.id !== id);

  // Jika setelah dihapus tidak ada data customer, hapus data dari localStorage
  if (dataCustomer.length === 0) {
    localStorage.removeItem("customerData");
    document.querySelector(
      ".isi-data"
    ).innerHTML = `<p><i class="fa-regular fa-folder-open"></i><br>Tidak ada data customer untuk ditampilkan.</p>`;
    document.querySelector(".success").innerHTML =
      'Data berhasil dihapus <i class="fa-solid fa-circle-check"></i>';
    document.querySelector(".success").classList.add("active");
    setTimeout(() => {
      document.querySelector(".success").classList.remove("active");
    }, 2300);
  } else {
    // Simpan data yang tersisa ke localStorage
    saveToLocalStorage(dataCustomer);
    tampilkanData();
  }
}

// Fungsi kembali ke menu
document.querySelector(".kembali1").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("menu").style.display = "grid";
  document.getElementById("tambahData").style.display = "none";
});

document.querySelector(".kembali2").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("menu").style.display = "grid";
  document.getElementById("tampilkanData").style.display = "none";
});

document.querySelector(".kembali3").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("menu").style.display = "grid";
  document.getElementById("editCustomer").style.display = "none";
  document.getElementById("editSearchInput").value = "";
  document.getElementById("editCustomerForm").reset();
  // Sembunyikan form edit
  document.getElementById("editForm").style.display = "none";
});

document.querySelector(".kembali4").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("menu").style.display = "grid";
  document.getElementById("cariCustomer").style.display = "none";
  document.getElementById("searchInput").value = "";
  document.getElementById("searchResult").style.display = "none";
});

// Fungsi untuk mencari customer
function cariCustomer() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();

  if (keyword === "") {
    document
      .getElementById("searchInput")
      .setCustomValidity("Masukkan ID customer");
    document.getElementById("searchInput").reportValidity();
    return;
  }

  // Ambil data dari localStorage setiap kali pencarian dilakukan
  const dataCustomer = getDataCustomerFromLocalStorage();

  const hasil = dataCustomer.filter(
    (customer) =>
      customer.id.toString() === keyword ||
      customer.nama.toLowerCase().includes(keyword)
  );

  const resultDiv = document.getElementById("searchResult");
  if (hasil.length > 0) {
    document.getElementById("searchResult").style.display = "block";
    document.getElementById("searchInput").value = "";
    let html = "<h3>Hasil pencarian</h3>";
    hasil.forEach((customer) => {
      html += `<p>ID: ${customer.id}, Nama: ${customer.nama}, Tanggal: ${customer.tanggal}<br>`;
      html += `Otak-otak: ${customer.otakOtak}, `;
      html += `Tahu Bulat: ${customer.tahuBulat}, `;
      html += `Sotong: ${customer.sotong}</p>`;
    });
    resultDiv.innerHTML = html;
  } else {
    document.getElementById("searchInput").value = "";
    document.querySelector(".error").innerHTML =
      'Customer Tidak Ditemukan <i class="fa-solid fa-circle-exclamation"></i>';
    document.querySelector(".error").classList.add("active");
    setTimeout(() => {
      document.querySelector(".error").classList.remove("active");
    }, 2300);
  }
}

// Fungsi untuk mencari customer yang akan diedit
function cariCustomerUntukEdit() {
  const id = parseInt(document.getElementById("editSearchInput").value);

  // Ambil data dari localStorage setiap kali pencarian dilakukan
  const dataCustomer = getDataCustomerFromLocalStorage();

  const customer = dataCustomer.find((c) => c.id === id);
  const editForm = document.getElementById("editForm");

  if (customer) {
    // Isi form edit dengan data customer yang ditemukan
    document.getElementById("editId").value = customer.id;
    document.getElementById("editNama").value = customer.nama;
    document.getElementById("editTanggal").value = customer.tanggal;
    document.getElementById("editOtakOtak").value = customer.otakOtak;
    document.getElementById("editTahuBulat").value = customer.tahuBulat;
    document.getElementById("editSotong").value = customer.sotong;

    editForm.style.display = "block";
  } else {
    document.getElementById("editSearchInput").value = "";
    document.querySelector(".error").innerHTML =
      'Data tidak ditemukan <i class="fa-solid fa-circle-exclamation"></i>';
    document.querySelector(".error").classList.add("active");
    setTimeout(() => {
      document.querySelector(".error").classList.remove("active");
    }, 2300);
  }
}

// Event listener untuk form edit customer
document
  .getElementById("editCustomerForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const id = parseInt(document.getElementById("editId").value);

    // Ambil data dari localStorage sebelum update
    let dataCustomer = getDataCustomerFromLocalStorage();

    // Membuat objek customer dengan data yang diupdate
    const updatedCustomer = {
      id: id,
      nama: document.getElementById("editNama").value,
      tanggal: document.getElementById("editTanggal").value,
      otakOtak: parseFloat(document.getElementById("editOtakOtak").value) || 0, // default to 0 if not a number
      tahuBulat:
        parseFloat(document.getElementById("editTahuBulat").value) || 0,
      sotong: parseFloat(document.getElementById("editSotong").value) || 0,
    };

    // Cari indeks customer yang akan diupdate
    const index = dataCustomer.findIndex((c) => c.id === id);
    if (index !== -1) {
      // Update data customer
      dataCustomer[index] = updatedCustomer;
      saveToLocalStorage(dataCustomer); // Simpan data terbaru

      document.querySelector(
        ".isi-data"
      ).innerHTML = `<p><i class="fa-regular fa-folder-open"></i><br>Tidak ada data customer untuk ditampilkan.</p>`;
      document.querySelector(".success").innerHTML =
        'Data berhasil diupdate <i class="fa-solid fa-circle-check"></i>';
      document.querySelector(".success").classList.add("active");
      setTimeout(() => {
        document.querySelector(".success").classList.remove("active");
      }, 2300);
      this.reset();
      editForm.style.display = "none";
      document.getElementById("editSearchInput").value = "";
    } else {
      document.getElementById("editSearchInput").value = "";
      document.querySelector(".error").innerHTML =
        'Gagalupdate data. Customer tidak ditemukan <i class="fa-solid fa-circle-exclamation"></i>';
      document.querySelector(".error").classList.add("active");
      setTimeout(() => {
        document.querySelector(".error").classList.remove("active");
      }, 2300);
    }
  });
