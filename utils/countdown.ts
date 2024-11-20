export default (countdownTime: Ref<number>, seconds: number): Promise<void> => {
  // let timeLeft: number = seconds;

  // const interval = setInterval(() => {
  //   if (timeLeft <= 0) {
  //     clearInterval(interval);
  //     console.log("Countdown finished!");
  //   } else {
  //     console.log(`${timeLeft} seconds remaining`);
  //     timeLeft--;
  //   }
  // }, 1000);

  countdownTime.value = seconds;
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (countdownTime.value <= 0) {
        clearInterval(interval);
        resolve();
      } else {
        countdownTime.value--;
      }
    }, 1000);
  });
};
