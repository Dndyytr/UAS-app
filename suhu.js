// fungsi hasil konversi
function hasilKonversi() {
  document.querySelector(".wadah-hasil").classList.add("active");
  document.getElementById("btnKonversi").disabled = true;
  document.getElementById("x").addEventListener("click", () => {
    document.querySelector(".wadah-hasil").classList.remove("active");
    setTimeout(() => {
      document.getElementById("result").innerHTML = "";
      document.getElementById("btnKonversi").disabled = false;
    }, 1000);
  });
}

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

// Fungsi untuk mengkonversi Celsius ke Fahrenheit
function celsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Fungsi untuk mengkonversi Celsius ke Kelvin
function celsiusToKelvin(celsius) {
  return celsius + 273.15;
}

// Fungsi untuk mengkonversi Celsius ke Reamur
function celsiusToReamur(celsius) {
  return (celsius * 4) / 5;
}

// Fungsi untuk mengkonversi Fahrenheit ke Celsius
function fahrenheitToCelsius(fahrenheit) {
  return ((fahrenheit - 32) * 5) / 9;
}

// Fungsi untuk mengkonversi Kelvin ke Celsius
function kelvinToCelsius(kelvin) {
  return kelvin - 273.15;
}

// Fungsi untuk mengkonversi Reamur ke Celsius
function reamurToCelsius(reamur) {
  return (reamur * 5) / 4;
}

// Fungsi untuk mengkonversi suhu apapun ke Celsius
function convertToCelsius(temp, unit) {
  switch (unit) {
    case "celsius":
      return temp;
    case "fahrenheit":
      return fahrenheitToCelsius(temp);
    case "kelvin":
      return kelvinToCelsius(temp);
    case "reamur":
      return reamurToCelsius(temp);
  }
}

// Fungsi utama untuk melakukan konversi suhu
function convertTemperature() {
  // Mengambil nilai input dari elemen HTML
  const inputTemp = parseFloat(document.getElementById("inputTemp").value);
  const inputUnit = document.getElementById("inputUnit").value;
  const outputUnit = document.getElementById("outputUnit").value;
  const resultDiv = document.getElementById("result");

  // Validasi input
  if (isNaN(inputTemp)) {
    document.querySelector(".error").classList.add("active");
    setTimeout(() => {
      document.querySelector(".error").classList.remove("active");
    }, 2300);
    return;
  }

  // Mengkonversi input ke Celsius sebagai langkah pertama
  const celsiusTemp = convertToCelsius(inputTemp, inputUnit);
  let result = "";

  // Fungsi untuk memformat hasil dengan 2 desimal dan simbol derajat
  function formatResult(value, unit) {
    return `${value.toFixed(2)}° ${unit}`;
  }

  // Melakukan konversi berdasarkan unit output yang dipilih
  if (outputUnit === "all") {
    // Jika 'Semua' dipilih, konversi ke semua unit
    result = `
            ${formatResult(celsiusTemp, "C")}<br>
            ${formatResult(celsiusToFahrenheit(celsiusTemp), "F")}<br>
            ${formatResult(celsiusToKelvin(celsiusTemp), "K")}<br>
            ${formatResult(celsiusToReamur(celsiusTemp), "R")}
        `;
  } else {
    // Jika unit spesifik dipilih, konversi hanya ke unit tersebut
    let convertedTemp;
    switch (outputUnit) {
      case "celsius":
        convertedTemp = celsiusTemp;
        break;
      case "fahrenheit":
        convertedTemp = celsiusToFahrenheit(celsiusTemp);
        break;
      case "kelvin":
        convertedTemp = celsiusToKelvin(celsiusTemp);
        break;
      case "reamur":
        convertedTemp = celsiusToReamur(celsiusTemp);
        break;
    }
    result = formatResult(convertedTemp, outputUnit.charAt(0).toUpperCase());
  }

  // Menampilkan hasil konversi
  resultDiv.innerHTML = `<h3>Hasil Konversi</h3> ${inputTemp}° ${inputUnit
    .charAt(0)
    .toUpperCase()} = ${result} <br> <button id="x">✖</button>`;

  hasilKonversi();

  // Mereset input setelah konversi
  resetInputs();
}

// Fungsi untuk mereset input setelah konversi
function resetInputs() {
  document.getElementById("inputTemp").value = "";
  document.getElementById("inputUnit").selectedIndex = 0;
  document.getElementById("outputUnit").selectedIndex = 0;
}

window.onload = function () {
  loading();
};
