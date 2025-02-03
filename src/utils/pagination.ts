export const getPagination = (_page: string, _limit: string) => {
    const page = parseInt(_page as string) || 1;
    const limit = parseInt(_limit as string) || 10;
    const skip = (page - 1) * limit;
    return { page, limit, skip };
};