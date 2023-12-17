const path = require('path');
const DoubleLinkedList = require('./doubleLinkedList');

class FoodOrderQueue {
  constructor() {
    this.currentQueue = new DoubleLinkedList();
    this.currentQueue.setFilepath(path.resolve('./data/data.json'));
    this.currentQueue.loadFromFile();

    this.transactionHistory = new DoubleLinkedList();
    this.transactionHistory.setFilepath(path.resolve('./data/transaction-history.json'));
    this.transactionHistory.loadFromFile();
  }

  enqueue(nama, pesanan, harga, jumlah) {
    this.currentQueue.addLast(nama, pesanan, harga, jumlah);
  }

  dequeue() {
    const servedOrder = this.currentQueue.removeFirst();
    if (servedOrder) {
      this.transactionHistory.addLast(servedOrder.nama, servedOrder.pesanan, servedOrder.harga, servedOrder.jumlah, servedOrder.id);
    }
  }

  count() {
    return this.currentQueue.toJSON().length;
  }

  clear() {
    this.currentQueue.head = null;
    this.currentQueue.tail = null;
    this.currentQueue.saveToFile();
  }
}

module.exports = FoodOrderQueue;
