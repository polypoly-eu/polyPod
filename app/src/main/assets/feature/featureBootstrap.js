console.log(`Bootstrapping Feature...`);

const feature = new Feature();

(async () => {
    const api = null;
    await feature.init(api);
    console.log(`Feature initialized!`);
})();
