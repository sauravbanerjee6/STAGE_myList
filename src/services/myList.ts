import MyList, { IMyList } from "../models/MyList";
// import redis from "../utils/redis";

type MyListServiceMap = {
    [key: string]: ((...args: any[]) => Promise<any>) | undefined; // allow additional functions
};

// Create the container object
const myListService: MyListServiceMap = {};

myListService.addToList = async (
    userId: string,
    contentId: string,
    contentType: 'Movie' | 'TVShow'
) => {
    try {
        const existing = await MyList.exists({ userId, contentId });

        if (!existing) {
            await MyList.create({
                userId,
                contentId,
                contentType,
                addedAt: new Date()
            });
        }

        const updated = await MyList.find({ userId });

        return {
            status: 200,
            data: updated,
            message: existing ? "Content already added!" : "Content added successfully!"
        };
    } catch (error) {
        console.log("Error adding content to user's list: ", error);
        return { status: 500, data: {}, message: "Could not update user list!" };
    }
}

myListService.removeFromList = async (
    userId: string,
    contentId: string
) => {
    try {

        const result = await MyList.deleteOne({ userId, contentId });

        if (result.deletedCount === 0) {
            return {
                status: 200,
                data: result,
                message: "Content not present in User's list!"
            };
        } else {
            return {
                status: 200,
                data: result,
                message: "Content removed from User's list!"
            }
        }

    } catch (error) {
        console.log("Error removing content from user's list: ", error);
        return { status: 500, data: {}, message: "Could not update user list!" };
    }
}

myListService.getMyList = async (
    userId: string,
    page: number = 1,
    limit: number = 10
) => {
    try {

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;

        const listItems = await MyList.find({ userId })
            .sort({ addedAt: -1 })
            .skip(offset)
            .limit(limit)
            .lean();

        return { status: 200, data: listItems, message: "huh" };

    } catch (error) {
        console.log("Error fetching user's list", error);
        return { status: 500, data: [], message: "Could not get user's list!" };
    }
}

export default myListService;