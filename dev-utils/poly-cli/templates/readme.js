export function template(feature_name, description) {
    let t = `
# ${feature_name}

${description}

## Build project

\`npm run build\`

    `;
    return t;
}
