import open from 'open';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const opener = function (url, waitingDelay = 0) {
  (async () => {
    await sleep(waitingDelay);
    await open(url);
  })();
};

export default opener;
