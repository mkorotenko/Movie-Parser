require('./service-manager').install()
  .then((mess) => {mess && console.log(mess)})
  .catch((err) => {err && console.error(err)});
