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

// Inisialisasi variabel global
let transactions = [];
let totalIncome = 0;
let totalExpense = 0;

// Fungsi untuk memformat angka ke dalam format mata uang Rupiah
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0, // Mengatur minimum angka desimal ke 0
    maximumFractionDigits: 0, // Mengatur maksimum angka desimal ke 0
  }).format(amount);
}

// Fungsi untuk menampilkan menu yang dipilih dan menyembunyikan yang lain
function showMenu(menuName) {
  // Menyembunyikan semua menu dengan display 'none'
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById("incomeMenu").style.display = "none";
  document.getElementById("expenseMenu").style.display = "none";
  document.getElementById("balanceMenu").style.display = "none";
  document.getElementById("transactionHistoryMenu").style.display = "none";

  // Tampilkan menu yang dipilih dengan display 'flex'
  document.getElementById(menuName + "Menu").style.display = "flex";

  // Update tampilan sesuai menu yang dipilih
  if (menuName === "balance") {
    updateBalanceSummary();
  } else if (menuName === "income") {
    updateTransactionHistory("pemasukan");
  } else if (menuName === "expense") {
    updateTransactionHistory("pengeluaran");
  } else if (menuName === "transactionHistory") {
    updateAllTransactionHistory(); // Tampilkan semua transaksi di menu riwayat transaksi
  }

  // Sembunyikan tombol menu utama (menu-buttons) saat membuka menu lain
  document.querySelector(".menu-buttons").style.display = "none";
}

// Fungsi untuk menambahkan transaksi baru
function addTransaction(type) {
  const nameInput = document.getElementById(
    type === "pemasukan" ? "incomeName" : "expenseName"
  );
  const amountInput = document.getElementById(
    type === "pemasukan" ? "incomeAmount" : "expenseAmount"
  );
  const name = nameInput.value;
  const amount = parseFloat(amountInput.value);

  if (!name) {
    nameInput.setCustomValidity("Mohon isi nama dengan benar.");
    nameInput.reportValidity();
    return;
  }

  if (isNaN(amount) || amount <= 0) {
    amountInput.setCustomValidity("Mohon isi jumlah dengan benar.");
    amountInput.reportValidity();
    return;
  }

  // Pengecekan jika transaksi adalah pengeluaran dan jumlahnya melebihi saldo
  if (type === "pengeluaran" && amount > totalIncome - totalExpense) {
    document.querySelector(".error").innerHTML =
      'Saldo tidak mencukupi <i class="fa-solid fa-circle-exclamation"></i>';
    document.querySelector(".error").classList.add("active");
    setTimeout(() => {
      document.querySelector(".error").classList.remove("active");
    }, 2300);
    nameInput.value = "";
    amountInput.value = "";
    return;
  }

  const transaction = {
    date: new Date().toLocaleString("id-ID"),
    type: type,
    name: name,
    amount: amount,
  };

  transactions.push(transaction);
  calculateTotals();
  saveData();

  updateTransactionHistory(type);
  nameInput.value = "";
  amountInput.value = "";

  document.querySelector(".success").classList.add("active");
  setTimeout(() => {
    document.querySelector(".success").classList.remove("active");
  }, 2300);
}

// Fungsi untuk menghitung total pemasukan dan pengeluaran
function calculateTotals() {
  totalIncome = transactions
    .filter((t) => t.type === "pemasukan")
    .reduce((sum, t) => sum + t.amount, 0);
  totalExpense = transactions
    .filter((t) => t.type === "pengeluaran")
    .reduce((sum, t) => sum + t.amount, 0);
}

// Fungsi untuk memperbarui tampilan ringkasan saldo
function updateBalanceSummary() {
  document.getElementById("totalIncome").textContent =
    formatCurrency(totalIncome);
  document.getElementById("totalExpense").textContent =
    formatCurrency(totalExpense);
  document.getElementById("currentBalance").textContent = formatCurrency(
    totalIncome - totalExpense
  );
}

// Fungsi untuk memperbarui tampilan riwayat transaksi
function updateTransactionHistory(type) {
  const historyDiv = document.getElementById(
    type === "pemasukan" ? "incomeHistory" : "expenseHistory"
  );
  if (!historyDiv) {
    alert("Element not found");
    return;
  }

  // Filter transaksi berdasarkan tipe
  const filteredTransactions = transactions.filter((t) => t.type === type);

  // Jika tidak ada transaksi, sembunyikan riwayat
  if (filteredTransactions.length === 0) {
    historyDiv.style.display = "none"; // Sembunyikan elemen historyDiv jika tidak ada transaksi
    return;
  }

  // Jika ada transaksi, tampilkan riwayat
  historyDiv.style.display = "block"; // Tampilkan kembali jika ada transaksi
  historyDiv.innerHTML = `<h3>Riwayat ${
    type.charAt(0).toUpperCase() + type.slice(1)
  }</h3>`;
  const table = document.createElement("table");
  table.innerHTML = `
        <tr>
            <th>Tanggal</th>
            <th>Nama</th>
            <th>Jumlah</th>
        </tr>
    `;

  transactions
    .filter((t) => t.type === type)
    .forEach((transaction) => {
      const row = table.insertRow();
      row.insertCell(0).textContent = transaction.date;
      row.insertCell(1).textContent = transaction.name;
      row.insertCell(2).textContent = formatCurrency(transaction.amount);
    });

  historyDiv.appendChild(table);
}

// Fungsi untuk memperbarui tampilan semua riwayat transaksi
function updateAllTransactionHistory() {
  const historyDiv = document.getElementById("transactionHistory");
  // Kosongkan elemen riwayat sebelum memperbarui tabel
  historyDiv.innerHTML = "";

  if (!localStorage.getItem("transactions")) {
    historyDiv.innerHTML = `<p><i class="fa-regular fa-folder-open"></i><br>Tidak ada riwayat transaksi</p>`;
    return;
  }

  const table = document.createElement("table");
  table.innerHTML = `
        <tr>
            <th>Tanggal</th>
            <th>Jenis</th>
            <th>Nama</th>
            <th>Jumlah</th>
        </tr>
    `;

  transactions.forEach((transaction) => {
    const row = table.insertRow();
    row.insertCell(0).textContent = transaction.date;

    const typeCell = row.insertCell(1);
    typeCell.textContent =
      transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);

    // Terapkan warna berdasarkan tipe transaksi
    if (transaction.type === "pemasukan") {
      typeCell.style.textShadow = "0 0 9px green"; // Warna hijau untuk pemasukan
    } else if (transaction.type === "pengeluaran") {
      typeCell.style.textShadow = "0 0 9px red"; // Warna merah untuk pengeluaran
    }

    row.insertCell(2).textContent = transaction.name;
    row.insertCell(3).textContent = formatCurrency(transaction.amount);
  });

  historyDiv.appendChild(table);
}

// Fungsi untuk menyimpan data transaksi ke localStorage
function saveData() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Fungsi untuk memuat data transaksi dari localStorage
function loadData() {
  const savedTransactions = localStorage.getItem("transactions");
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions);
    calculateTotals();
  }
}

// Memuat data saat halaman pertama kali dibuka
window.onload = function () {
  loadData();
  loading();
};

// Fungsi untuk menampilkan kembali menu utama
function backToMainMenu() {
  document.getElementById("incomeName").value = "";
  document.getElementById("incomeAmount").value = "";
  document.getElementById("expenseName").value = "";
  document.getElementById("expenseAmount").value = "";

  // Sembunyikan semua menu
  document.getElementById("incomeMenu").style.display = "none";
  document.getElementById("expenseMenu").style.display = "none";
  document.getElementById("balanceMenu").style.display = "none";
  document.getElementById("transactionHistoryMenu").style.display = "none";

  // Tampilkan kembali menu utama dengan gaya grid
  document.querySelector(".menu-buttons").style.display = "grid";
}
