// Import modules
import { Client, Databases, Permission, Role, Teams } from "node-appwrite";

// Request type
interface Request {
    headers: {
        [key: string]: string;
    };
    payload: {
        [key: string]: string;
    };
    variables: {
        [key: string]: string;
    };
}

// Reponse type
interface Response {
    send: (text: string, status?: number) => void;
    json: (obj: any, status?: number) => void;
}

// Event Data
interface EventData {
    $id: string;
    name: string;
}

// Database structure
const database_structure = {
    collections: [
        {
            name: "categories",
            rules: [
                {
                    key: "title",
                    required: true,
                    array: false,
                },
                {
                    key: "description",
                    required: true,
                    array: false,
                },
                {
                    key: "completed",
                    required: true,
                    array: false,
                },
                {
                    key: "icon",
                    required: true,
                    array: false,
                },
                {
                    key: "color",
                    required: true,
                    array: false,
                },
            ],
        },
        {
            name: "todos",
            rules: [
                {
                    key: "title",
                    required: true,
                    array: false,
                },
                {
                    key: "due_date",
                    required: true,
                    array: false,
                },
                {
                    key: "priority",
                    required: true,
                    array: false,
                },
                {
                    key: "assignee",
                    required: true,
                    array: true,
                },
                {
                    key: "category",
                    required: true,
                    array: false,
                },
                {
                    key: "completed",
                    required: false,
                    array: false,
                },
            ],
        },
        {
            name: "chat",
            rules: [
                {
                    key: "message",
                    required: true,
                    array: false,
                },
                {
                    key: "timestamp",
                    required: true,
                    array: false,
                },
                {
                    key: "author",
                    required: true,
                    array: false,
                },
            ],
        },
    ],
};

const setup_workspace = async function (req: Request, res: Response) {
    const client = new Client();

    const database = new Databases(client);

    if (
        !req.variables["APPWRITE_FUNCTION_ENDPOINT"] ||
        !req.variables["APPWRITE_FUNCTION_API_KEY"]
    ) {
        console.warn(
            "Environment variables are not set. Function cannot use Appwrite SDK."
        );
    } else {
        client
            .setEndpoint(req.variables["APPWRITE_FUNCTION_ENDPOINT"])
            .setProject(req.variables["APPWRITE_FUNCTION_PROJECT_ID"])
            .setKey(req.variables["APPWRITE_FUNCTION_API_KEY"])
            .setSelfSigned(true);
    }

    const event_data: EventData = JSON.parse(
        req.variables["APPWRITE_FUNCTION_EVENT_DATA"]
    );

    // Setup the workspace according to the structure
    try {
        await database.create(event_data.$id, event_data.name);

        for (const collection of database_structure.collections) {
            await database.createCollection(
                event_data.$id,
                collection.name,
                collection.name,
                [
                    Permission.read(Role.team(event_data.$id)),
                    Permission.write(Role.team(event_data.$id)),
                    Permission.update(Role.team(event_data.$id)),
                    Permission.delete(Role.team(event_data.$id)),
                ]
            );

            for (const rules of collection.rules) {
                await database.createStringAttribute(
                    event_data.$id,
                    collection.name,
                    rules.key,
                    100000,
                    rules.required,
                    "",
                    rules.array
                );
            }
        }

        res.json({ message: "Workspace setup successfully" });
    } catch (e: any) {
        return res.json({
            error: e.message,
        });
    }
};

export default setup_workspace;

// Uncomment to test
// setup_workspace(
//     {
//         headers: {},
//         payload: {},
//         variables: {
//             APPWRITE_FUNCTION_ENDPOINT: "<your_endpoint>",
//             APPWRITE_FUNCTION_PROJECT_ID: "<your_project_id>",
//             APPWRITE_FUNCTION_API_KEY: "<your_api_key>",
//             APPWRITE_FUNCTION_EVENT_DATA: JSON.stringify({
//                 $id: "<your_id>",
//                 name: "<your_name>",
//             }),
//         },
//     },
//     {
//         json(obj, status) {
//             console.log(obj);
//         },
//         send(text, status) {
//             console.log(text);
//         },
//     }
// );
