function checkNotHTML( zipFile ) {
    const profileHTMLfile = zipFile.getEntries.filter(
        (f) => f === "profile_information/profile_information.html"
    );
    if ( profileHTMLfile.length >= 1 ) {
        return "This zip file contains HTML, not JSON files"
    } else {
        return ""
    }
}

