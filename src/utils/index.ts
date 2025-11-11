


export function createPageUrl(pageName: string) {
    // Convert page names to lowercase URLs that match our routing structure
    return '/' + pageName.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/ /g, '');
}