require('./service-manager').uninstall()
  .then((mess) => {mess && console.log(mess)})
  .catch((err) => {err && console.error(err)});