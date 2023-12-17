const { generateId } = require('../utils/uuid');
const fs = require('fs');

class Node {
  constructor(nama, pesanan, harga, jumlah, id = false) {
    this.id = id ? id : generateId();
    this.nama = nama;
    this.pesanan = pesanan;
    this.harga = harga;
    this.jumlah = jumlah;
    this.totalHarga = harga * jumlah;
    this.next = null;
    this.prev = null;
  }
}

class DoubleLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.filepath = null;
  }

  setFilepath(filepath) {
    this.filepath = filepath;
  }

  addLast(nama, pesanan, harga, jumlah, id = false, isFirstLoad = false) {
    const newNode = new Node(nama, pesanan, harga, jumlah, id);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }
    if (!isFirstLoad) {
      this.saveToFile();
    }
  }

  removeFirst() {
    if (!this.head) {
      console.log('Antrian kosong!');
      return null;
    }

    const removedNode = this.head;
    this.head = this.head.next;

    if (this.head) {
      this.head.prev = null;
    } else {
      this.tail = null;
    }

    this.saveToFile();
    return removedNode;
  }

  toJSON() {
    const result = [];
    let current = this.head;

    while (current !== null) {
      result.push({
        id: current.id,
        nama: current.nama,
        pesanan: current.pesanan,
        harga: current.harga,
        jumlah: current.jumlah,
        totalHarga: current.totalHarga,
      });
      current = current.next;
    }

    return result;
  }

  saveToFile() {
    if (this.filepath) {
      const updatedData = this.toJSON();

      fs.writeFileSync(this.filepath, JSON.stringify(updatedData, null, 2));
    }
  }

  loadFromFile() {
    if (this.filepath) {
      if (fs.existsSync(this.filepath)) {
        const existingJson = fs.readFileSync(this.filepath, 'utf-8');
        const existingData = JSON.parse(existingJson);

        this.head = null;
        this.tail = null;

        existingData.forEach((item) => {
          this.addLast(item.nama, item.pesanan, item.harga, item.jumlah, item.id, true);
        });
      }
    }
  }
}

module.exports = DoubleLinkedList;
