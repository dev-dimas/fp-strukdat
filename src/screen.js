const { Input, NumberPrompt, Select } = require('enquirer');
const FoodOrderQueue = require('./queue.js');
const { Table } = require('console-table-printer');

const foodOrder = new FoodOrderQueue();

function welcomeScreen() {
  console.log('====================================');
  console.log('Selamat Datang di Kedai Kopi Dadakan');
  console.log('====================================');
}

async function selectProgramScreen() {
  try {
    let isExit = false;

    while (!isExit) {
      console.log('\n');
      const selectedProgram = await new Select({
        name: 'program',
        message: 'Silahkan pilih program yang ingin dijalankan :',
        choices: [
          '1. Tambah Pesanan',
          '2. Selesaikan Antrian Teratas',
          '3. Lihat Antrian Pesanan',
          '4. Hapus Seluruh Antrian',
          '5. Lihat Riwayat Pesanan',
          '6. Keluar',
        ],
      }).run();

      switch (selectedProgram) {
        case '1. Tambah Pesanan':
          await tambahPesanan();
          break;

        case '2. Selesaikan Antrian Teratas':
          await selesaikanAntrianTeratas();
          break;

        case '3. Lihat Antrian Pesanan':
          await lihatAntrianPesanan();
          break;

        case '4. Hapus Seluruh Antrian':
          await hapusSeluruhAntrian();
          break;

        case '5. Lihat Riwayat Pesanan':
          await lihatRiwayatAntrian();
          break;

        case '6. Keluar':
          isExit = true;
          break;

        default:
          break;
      }
    }

    exitScreen();
  } finally {
    return;
  }
}

async function tambahPesanan() {
  console.clear();
  console.log('Tambah Pesanan\n');

  const menuKopi = [
    { nama: 'Flat White', harga: 25000 },
    { nama: 'Caramel Macchiato', harga: 30000 },
    { nama: 'Iced Vanilla Latte', harga: 28000 },
    { nama: 'Cold Brew', harga: 35000 },
    { nama: 'Hazelnut Espresso', harga: 32000 },
    { nama: 'Matcha Latte', harga: 27000 },
    { nama: 'Affogato', harga: 40000 },
    { nama: 'Mocha Frappe', harga: 33000 },
    { nama: 'Turmeric Latte', harga: 29000 },
    { nama: 'Espresso Con Panna', harga: 26000 },
  ];

  try {
    const namaPembeli = await new Input({
      name: 'namaPembeli',
      message: 'Nama :',
      initial: 'Masukkan nama pembeli',
    }).run();

    let pesanan = await new Select({
      name: 'pesanan',
      message: 'Pilih menu kopi :',
      choices: menuKopi.map((menu) => `${menu.nama} - Rp${menu.harga.toLocaleString('id')}`),
    }).run();

    const jumlah = await new NumberPrompt({
      name: 'jumlah',
      message: 'Masukkan jumlah pesanan :',
      float: false,
      initial: 1,
      validate: function (value) {
        if (value <= 0) {
          this.value = undefined;
          return 'Jumlah pesanan minimal 1!';
        } else {
          return true;
        }
      },
    }).run();

    const selectedMenu = menuKopi.find((menu) => menu.nama.startsWith(pesanan.split(' - Rp')[0]));
    pesanan = selectedMenu.nama;
    const harga = selectedMenu.harga;

    foodOrder.enqueue(namaPembeli, pesanan, harga, jumlah);
    console.log('Berhasil menambahkan antrian!.');
  } catch {
    console.log('Gagal menambahkan antrian!.');
  }
}

async function selesaikanAntrianTeratas() {
  console.clear();
  try {
    if (foodOrder.count()) {
      foodOrder.dequeue();
      console.log('Berhasil menyelesaikan 1 antrian teratas.');
    } else {
      console.log('Tidak ada data antrian!');
    }
  } catch {
    console.log('Gagal menyelesaikan 1 antrian teratas.');
  }
}

async function lihatAntrianPesanan() {
  console.clear();
  try {
    const queue = foodOrder.currentQueue.toJSON();
    if (queue.length) {
      const table = new Table({
        columns: [
          { name: 'No', alignment: 'left' },
          { name: 'ID Pesanan', alignment: 'left' },
          { name: 'Nama', alignment: 'left' },
          { name: 'Pesanan', alignment: 'left' },
          { name: 'Harga', alignment: 'center' },
          { name: 'Jumlah', alignment: 'center' },
          { name: 'Total Harga', alignment: 'center' },
        ],
      });
      queue.forEach((queue, index) => {
        table.addRow({
          No: index + 1,
          'ID Pesanan': queue.id,
          Nama: queue.nama,
          Pesanan: queue.pesanan,
          Harga: queue.harga,
          Jumlah: queue.jumlah,
          'Total Harga': queue.totalHarga,
        });
      });
      table.printTable();
    } else {
      console.log('Tidak ada data antrian!');
    }
  } catch {
    console.log('Gagal menampilkan antrian pesanan!');
  }
}

async function hapusSeluruhAntrian() {
  console.clear();
  try {
    if (!foodOrder.count.length) {
      console.log('Tidak ada data antrian!');
      return;
    }
    const confirmDelete = await new Select({
      name: 'confirmDelete',
      message: 'Apakah anda yakin ingin menghapus seluruh antrian saat ini?',
      choices: ['Iya', 'Tidak'],
    }).run();
    if (confirmDelete === 'Iya') {
      foodOrder.clear();
      console.log('Berhasil menghapus seluruh antrian!');
      return;
    }
    return;
  } catch {
    console.log('Gagal menghapus seluruh antrian!');
  }
}

async function lihatRiwayatAntrian() {
  console.clear();
  try {
    const history = foodOrder.transactionHistory.toJSON();
    if (history.length) {
      const table = new Table({
        columns: [
          { name: 'No', alignment: 'left' },
          { name: 'ID Pesanan', alignment: 'left' },
          { name: 'Nama', alignment: 'left' },
          { name: 'Pesanan', alignment: 'left' },
          { name: 'Harga', alignment: 'center' },
          { name: 'Jumlah', alignment: 'center' },
          { name: 'Total Harga', alignment: 'center' },
        ],
      });
      history.forEach((queue, index) => {
        table.addRow({
          No: index + 1,
          'ID Pesanan': queue.id,
          Nama: queue.nama,
          Pesanan: queue.pesanan,
          Harga: queue.harga,
          Jumlah: queue.jumlah,
          'Total Harga': queue.totalHarga,
        });
      });
      table.printTable();
    } else {
      console.log('Tidak ada data riwayat pesanan!');
    }
  } catch {
    console.log('Gagal menampilkan riwayat pesanan!');
  }
}

function exitScreen() {
  console.clear();
  console.log('\nAnda telah memilih menu keluar.');
  console.log('Terima kasih telah menggunakan program ini.');
}

module.exports = { welcomeScreen, selectProgramScreen };
