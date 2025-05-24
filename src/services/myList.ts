import MyList, { IMyListItem } from "../models/MyList";

type MyListServiceMap = {
    // addToList?: (userId: string,
    //     contentId: string,
    //     contentType: 'Movie' | 'TVShow') => Promise<any>;

    // removeFromList?: (userId: string,
    //     contentId: string) => Promise<any>;
    [key: string]: ((...args: any[]) => Promise<any>) | undefined; // allow additional functions
};

// Create the container object
const myListService: MyListServiceMap = {};

// myListService.addToList = async (
//     userId: string,
//     contentId: string,
//     contentType: 'Movie' | 'TVShow'
// ) => {
//     try {
//         //check if user has a list saved
//         const userExists = await MyList.findOne({ userId });

//         if (userExists) {
//             //check if the user has already added the show to his list
//             const showExists = userExists.items.some(
//                 (item) => item.contentId === contentId
//             );

//             if (showExists)
//                 return { status: 200, data: userExists, message: "Content Already in user's list!" };

//             userExists.items.push(({ contentId, contentType, addedAt: new Date() }));

//             return { status: 200, data: await userExists.save(), message: "User List Updated!" };
//         } else {
//             //user does not have a list, so creating one
//             const newList = new MyList({
//                 userId: userId,
//                 items: {
//                     contentId, contentType, addedAt: new Date()
//                 }
//             });

//             return { status: 201, data: await newList.save(), message: "User List Created!" };

//         }
//     } catch (error) {
//         console.log("Error adding content to user's list: ", error);
//         return { status: 500, data: {}, message: "Could not update user list!" };
//     }
// }

myListService.addToList = async (
    userId: string,
    contentId: string,
    contentType: 'Movie' | 'TVShow'
) => {
    try {
        //check if user has a list saved
        const contentExists = await MyList.exists({ userId, "items.contentId": contentId });

        if (!contentExists) {
            await MyList.findOneAndUpdate(
                { userId },
                {
                    $push: {
                        items: { contentId, contentType, addedAt: new Date() }
                    }
                },
                { upsert: true }
            );
        }


        const updated = await MyList.find({ userId });

        return { status: 200, data: updated, message: contentExists ? "Content already added!" : "Content added successfully!" };
    } catch (error) {
        console.log("Error adding content to user's list: ", error);
        return { status: 500, data: {}, message: "Could not update user list!" };
    }
}

myListService.removeFromList = async (
    userId: string,
    contentId: string | string[]
) => {
    try {

        const contentIds = Array.isArray(contentId) ? contentId : [contentId];

        const result = await MyList.updateOne(
            { userId, "items.contentId": contentId },
            { $pull: { items: { contentId: { $in: contentIds } } } }
        );

        if (result.matchedCount === 0) {
            return { status: 200, data: result, message: "Content/User not present in User's list!" };
        } else if (result.modifiedCount === 0) {
            return { status: 200, data: result, message: "Content removed from User's list!" };
        } else {
            return { status: 200, data: result, message: "Content removed from User's list!" };
        }

    } catch (error) {
        console.log("Error removing content from user's list: ", error);
        return { status: 500, data: {}, message: "Could not update user list!" };
    }
}

// myListService.getMyList = async (
//     userId: string,
//     page: number = 1,
//     limit: number = 10
// ) => {
//     try {
//         const offset = (page - 1) * limit;
//         const result = await MyList.findOne({ userId });

//         if (!result)
//             return { status: 200, data: [], message: "No Saved lists for User!" };

//         return { status: 200, data: result.items.slice(offset, offset + limit), message: "Got User's List successfully!" };
//     } catch (error) {
//         console.log("Error fetching user's list", error);
//         return { status: 500, data: [], message: "Could not get user's list!" };
//     }
// }

myListService.getMyList = async (
    userId: string,
    page: number = 1,
    limit: number = 10
) => {
    try {

        page = Number(page);
        limit = Number(limit);

        const offset = (page - 1) * limit;
        const result = await MyList.findOne(
            { userId },
            { items: { $slice: [offset, limit] } }
        ).lean();

        if (!result) {
            return {
                status: 204,
                data: [],
                message: "No list found for user!"
            };
        }

        return { status: 200, data: result.items, message: "Got User's List successfully!" };
    } catch (error) {
        console.log("Error fetching user's list", error);
        return { status: 500, data: [], message: "Could not get user's list!" };
    }
}

export default myListService;