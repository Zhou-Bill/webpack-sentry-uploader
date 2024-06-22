class PromiseQueue {
  constructor(maxConcurrent) {
    this.maxConcurrent = maxConcurrent;
    this.queue = [];
    this.running = 0;
    // this.donePromise = null
    // this.rejectPromise = null
    this.promise = null
    this.callback = null
  }

  addTask(task) {
    this.queue.push({task})
   
  }

  start() {
    this.promise = new Promise((resolve, reject) => {
      this.callback = {
        resolve: (data) => {
          console.log('complete', data)
          resolve()
        },
        reject
      }
      this.processQueue();
    });
    return this.promise
  }

  settle() {
    this.callback.resolve()
    this.promise = null
    this.callback = null
  }

  processQueue() {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const { task } = this.queue.shift();
      this.running++;
      Promise.resolve(task())
        .then((data) => {
          console.log(data, task)
          return data
        })
        .finally(() => {
          this.running--;
          if (this.running === 0 && this.queue.length === 0) {
            this.settle()
          }
          this.processQueue();
        })
    }

  }
}

const processQueue = new PromiseQueue(2); // 设置最大并发数为10

// processQueue.addTask(() => {
//   return new Promise((resolve, reject) => {
//     // 模拟一个耗时的任务
//     setTimeout(() => {
//       resolve('Task 1 completed');
//     }, 4000);
//   })
// })
// processQueue.addTask(() => {
//   return new Promise((resolve, reject) => {
//     // 模拟一个耗时的任务
//     setTimeout(() => {
//       resolve('Task 2 completed');
//     }, 4000);
//   })
// })

// processQueue.addTask(() => {
//   return new Promise((resolve, reject) => {
//     // 模拟一个耗时的任务
//     setTimeout(() => {
//       resolve('Task 3 completed');
//     }, 1000);
//   })
// })
// processQueue.addTask(() => {
//   return new Promise((resolve, reject) => {
//     // 模拟一个耗时的任务
//     setTimeout(() => {
//       resolve('Task 4 completed');
//     }, 1000);
//   })
// })
// processQueue.addTask(() => {
//   return new Promise((resolve, reject) => {
//     // 模拟一个耗时的任务
//     setTimeout(() => {
//       resolve('Task 5 completed');
//     }, 3000);
//   })
// })

// processQueue.addTask(() => {
//   return new Promise((resolve, reject) => {
//     // 模拟一个耗时的任务
//     setTimeout(() => {
//       resolve('Task 6 completed');
//     }, 1000);
//   })
// })
// processQueue.addTask(() => {
//   return new Promise((resolve, reject) => {
//     // 模拟一个耗时的任务
//     setTimeout(() => {
//       resolve('Task 7 completed');
//     }, 2000);
//   })
// })

// processQueue.start().then(() => {
//   console.log('All tasks completed');
// })
module.exports = processQueue;
// export default PromiseQueue;