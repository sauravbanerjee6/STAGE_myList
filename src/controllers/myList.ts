import { Request, Response } from "express";
import myListService from "../services/myList";

type MyListControllerMap = {
    // addToList?: (req: Request, resp: Response) => Promise<any>;

    // removeFromList?: (id: number) => Promise<boolean>;
    [key: string]: ((...args: any[]) => Promise<any>) | undefined; // allow additional functions
};

// Create the container object
const myListController: MyListControllerMap = {};

myListController.addToList = async (req: Request, resp: Response) => {
    try {
        const { userId, contentId, contentType } = req.body;

        if (!(userId && contentId && contentType)) {
            return resp.status(400).json({ message: "Missing required fields!" });
        }

        const result = await myListService?.addToList?.(userId, contentId, contentType);
        resp.status(result.status).json({ message: result.message, data: result.data })


    } catch (error) {
        console.error('Add to list error:', error);
        resp.status(500).json({ error: 'Internal server error' });
    }
}

myListController.removeFromList = async (req: Request, resp: Response) => {
    try {
        const { userId, contentId } = req.body;

        if (!(userId && contentId)) {
            return resp.status(400).json({ message: "Missing required fields!" });
        }

        const result = await myListService?.removeFromList?.(userId, contentId);

        resp.status(result.status).json({ message: "Removed content from User's list!" });
    } catch (error) {
        console.error('Remove from list error:', error);
        resp.status(500).json({ error: 'Internal server error' });
    }
}

myListController.getMyList = async (req: Request, resp: Response) => {
    try {
        // const { userId, page, limit } = req.body;
        const userId = req.params.userId;
        const page = req.query.page;
        const limit = req.query.limit;

        if (!(userId)) {
            return resp.status(400).json({ message: "Missing required fields!" });
        }

        const result = await myListService?.getMyList?.(userId, page, limit);

        resp.status(result.status).json({ message: result.message , data: result.data});
    } catch (error) {
        console.error('Fetching user list error:', error);
        resp.status(500).json({ error: 'Internal server error' });
    }
}
export default myListController;