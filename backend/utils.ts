export const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long' as const, month: 'long' as const, day: 'numeric' as const };
    return date.toLocaleDateString('en-US', options);
};