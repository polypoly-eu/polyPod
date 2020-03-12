try {
    const featureClass = featureDefinition();
    let feature = new featureClass();
    feature.init(pod)
        .then(() => {
            console.log(`Feature initialized!`);
        });
} catch (err) {
    console.error(`Error while loading and initializing of a Feature.: ${err}`);
}
