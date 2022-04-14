//  So, typescript can read json files
declare module "*.json" {
    const value: any;
    export default value;
}
