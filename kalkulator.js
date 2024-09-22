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

// Fungsi untuk menampilkan hasil perhitungan
function hasilHitung() {
    document.querySelector(".wadah-hasil").classList.add("active");
    document.getElementById("btnHitung").disabled = true;
    document.getElementById("x").addEventListener("click", () => {
      document.querySelector(".wadah-hasil").classList.remove("active");
      setTimeout(() => {
        document.getElementById("result").innerHTML = "";
        document.getElementById("btnHitung").disabled = false;
      }, 1000);
    });
  }

// Penjelasan:
// 1. Fungsi ini menambahkan class 'active' ke elemen dengan class 'wadah-hasil'
// 2. Menonaktifkan tombol hitung
// 3. Menambahkan event listener ke tombol 'x' untuk menutup hasil
// 4. Saat ditutup, menghapus isi result dan mengaktifkan kembali tombol hitung setelah 1 detik

function formatResult(value) {
    if (Number.isInteger(value)) {
        return value.toString();
    } else {
        return value.toFixed(4);
    }
}

// Penjelasan:
// Fungsi ini memformat hasil:
// - Jika bilangan bulat, mengembalikan sebagai string tanpa desimal
// - Jika bilangan desimal, mengembalikan dengan 4 angka di belakang koma

function calculate() {
    const num1 = parseFloat(document.getElementById('num1').value);
    const operator = document.getElementById('operator').value;
    const num2 = parseFloat(document.getElementById('num2').value);
    let result;

    const num2Input = document.getElementById('num2');
    if (isNaN(num1) || (num2Input.style.display !== 'none' && isNaN(num2))) {
        document.querySelector('.error').classList.add('active');
        setTimeout(() => {
            document.querySelector('.error').classList.remove('active');
        }, 2300);
        return;
    }

    // Switch case untuk perhitungan berdasarkan operator
    switch(operator) {
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num2 !== 0 ? num1 / num2 : "Error: Pembagian dengan nol";
            break;
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '%':
            result = num1 % num2;
            break;
        case '^':
            result = Math.pow(num1, num2);
            break;
        case 'v':
            result = Math.sqrt(num1);
            break;
        case 'sin':
            result = Math.sin(num1 * Math.PI / 180);
            break;
        case 'cos':
            result = Math.cos(num1 * Math.PI / 180);
            break;
        case 'tan':
            result = Math.tan(num1 * Math.PI / 180);
            break;
        case 'lingkaran':
            const luas = Math.PI * Math.pow(num1, 2);
            const volume = (4/3) * Math.PI * Math.pow(num1, 3);
            result = `Luas Lingkaran = ${formatResult(luas)}, Volume Bola = ${formatResult(volume)}`;
            break;
        case 'kubus':
            const luasPermukaan = 6 * Math.pow(num1, 2);
            const volumeKubus = Math.pow(num1, 3);
            result = `Luas Permukaan Kubus = ${formatResult(luasPermukaan)}, Volume Kubus = ${formatResult(volumeKubus)}`;
            break;
        default:
            result = "Operator tidak valid";
    }

   
    // Menggunakan innerHTML alih-alih innerText
    document.getElementById('result').innerHTML = `
        <h3>Hasil</h3>
        <p>${typeof result === 'number' ? formatResult(result) : result}</p>
        <button id="x">✖</button>
    `;
    
    hasilHitung();

    // Membersihkan input setelah perhitungan
    document.getElementById('num1').value = '';
    document.getElementById('num2').value = '';
}

// Penjelasan:
// 1. Mengambil nilai input dan operator
// 2. Memeriksa input yang tidak valid
// 3. Melakukan perhitungan berdasarkan operator
// 4. Menampilkan hasil (namun dengan masalah rendering HTML)
// 5. Memanggil fungsi hasilHitung() untuk menampilkan hasil
// 6. Membersihkan input

document.getElementById('operator').addEventListener('change', function() {
    const num2Input = document.getElementById('num2');
    const num2Label = document.querySelector('label[for="num2"]');
    const selectedOperator = this.value;
    if (['v', 'sin', 'cos', 'tan', 'lingkaran', 'kubus'].includes(selectedOperator)) {
        num2Input.style.display = 'none';
        num2Label.style.display = 'none';
    } else {
        num2Input.style.display = 'block';
        num2Label.style.display = 'block';
    }
});

// Penjelasan:
// Event listener ini menyembunyikan atau menampilkan input kedua
// berdasarkan operator yang dipilih

window.onload = function () {
    loading();
  };
  