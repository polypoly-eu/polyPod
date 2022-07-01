export function readmeTemplate(feature_name, description, feature_type) {
    let base = `
# ${feature_name}

${description}

## Build project

\`npm run build\`

## Run Feature 

Open \`dist/index.html\` in your favorite browser.
    `;

    let preview_addon = `
## Customize Preview Feature

There are 3 files that you will need to modify:
1. content.json - here you can congfigure the content like titles, footer, section, images, etc. 
2. translation files - here you add the keys for the strings. The keys you add here you need to use in content.json.
3. manifest.json - customize the "learn-more" link to point to the website you want to open when the user presses the Learn More button in the footer. 

The content.json and the translation files come with some default content. Use that as an example. 
    `;

    switch (feature_type) {
        case "preview":
            return base + preview_addon;
        default:
            return base;
    }
}
