export const IsJson  = str => {
    try {
        JSON.parse(str);
        return  true;
    } catch {
        return false;
    }
};
