const fs = require('fs');
const path = require('path');
const { JSONFileManager } = require('../utils/jsonFileManager');
const { Table } = require('console-table-printer');

const filePath = path.resolve('./data/data.json');
const jsonFileManager = new JSONFileManager(filePath);
let lastEventTime = Date.now();

const displayQueue = async () => {
  console.clear();
  const table = new Table({
    columns: [
      { name: 'No', alignment: 'left' },
      { name: 'ID Pesanan', alignment: 'left', minLen: 36 },
      { name: 'Nama', alignment: 'left', minLen: 8 },
      { name: 'Pesanan', alignment: 'left' },
      { name: 'Harga', alignment: 'center', minLen: 5 },
      { name: 'Jumlah', alignment: 'center', minLen: 1 },
      { name: 'Total Harga', alignment: 'center', minLen: 5 },
    ],
  });
  const queue = await jsonFileManager.readAllData();
  const totalQueue = queue.length;

  if (totalQueue) {
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
  }

  if (totalQueue < 5) {
    let countIndex = totalQueue;
    for (let index = 1; index <= 5 - totalQueue; index++) {
      table.addRow({
        No: countIndex + 1,
        'ID Pesanan': '',
        Nama: '',
        Pesanan: '',
        Harga: '',
        Jumlah: '',
        'Total Harga': '',
      });
      countIndex++;
    }
  }

  table.printTable();
};

displayQueue();

fs.watch(filePath, async (event, filename) => {
  const currentTime = Date.now();
  const timeDiff = currentTime - lastEventTime;

  if (timeDiff < 1000) {
    return;
  }

  lastEventTime = currentTime;

  if (event === 'change') {
    console.clear();
    await displayQueue();
  }
});
