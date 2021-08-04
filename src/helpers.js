module.exports = {
  getCustomDataBackend,
};

function getCustomDataBackend() {
  // retrieve data from your own database
  const customData = "hydratedInBackend";
  return customData;
}
