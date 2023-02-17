import { Models, Query } from "@pankod/refine-appwrite";
import { Box, Flex, Image, Spinner, Text } from "@pankod/refine-chakra-ui";
import feathericons from "feather-icons";
import { ComponentType, useEffect, useState } from "react";
import { Check } from "react-feather";
import { account, database } from "src/utility";
import moment from "moment";
import Bold from "./Bold";

interface NotificationListProps {
    container: ComponentType<any>;
    animatedelement: ComponentType<any>;
}

interface Notification extends Models.Document {
    icon: string;
    message: string;
}

const NotificationList: React.FC<NotificationListProps> = ({
    container: Container,
    animatedelement: AnimatedElement,
}) => {
    const [notifications, set_notifications] = useState<Array<Notification>>(
        []
    );
    const icons: { [key: string]: any } = new Object(feathericons.icons);
    const [loading, set_loading] = useState<boolean>(true);

    useEffect(() => {
        const fetch_data = async () => {
            const current_user = await account.get();

            set_notifications(
                (
                    await database.listDocuments<Notification>(
                        current_user.name,
                        "notifications",
                        [Query.orderDesc("$createdAt")]
                    )
                ).documents
            );

            set_loading(false);
        };

        fetch_data();
    }, []);

    const remove_notification = async (id: string) => {
        set_notifications(notifications.filter((v) => v.$id !== id));

        const current_user = await account.get();

        await database.deleteDocument(current_user.name, "notifications", id);
    };

    return (
        <Container direction="column" gap={5} marginTop={8}>
            {notifications.map((n) => {
                return (
                    <AnimatedElement
                        key={n.$id}
                        bg="#dde0f2"
                        alignItems="center"
                        padding={3}
                        initial={{
                            opacity: 0,
                            transform: "translateY(30px)",
                        }}
                        animate={{
                            opacity: 1,
                            transform: "translateY(0px)",
                        }}
                        exit={{ opacity: 0, transform: "translateY(30px)" }}
                        borderRadius="lg"
                    >
                        <Flex
                            bg="#d2d8f3"
                            padding={3}
                            justifyContent="center"
                            alignItems={"center"}
                            borderRadius="full"
                        >
                            <Text
                                dangerouslySetInnerHTML={{
                                    __html: icons[n.icon].toSvg({
                                        width: 20,
                                        height: 20,
                                    }),
                                }}
                            />
                        </Flex>
                        <Bold marginLeft={6}>{n.message}</Bold>
                        <Text
                            marginLeft={"auto"}
                            marginRight={10}
                            color="gray.600"
                        >
                            {moment(n.$createdAt).fromNow()}
                        </Text>
                        <Box
                            bg="#a6d3a6"
                            onClick={() => remove_notification(n.$id)}
                            padding={3}
                            cursor="pointer"
                            borderRadius="lg"
                        >
                            <Check />
                        </Box>
                    </AnimatedElement>
                );
            })}
            {loading ? (
                <Flex
                    width="full"
                    height="50vh"
                    alignItems={"center"}
                    justifyContent="center"
                >
                    <Spinner color="#2E3440" />
                </Flex>
            ) : notifications.length == 0 ? (
                <Flex
                    width="full"
                    height="50vh"
                    alignItems={"center"}
                    direction="column"
                    justifyContent="center"
                >
                    <Image src="/images/nonotifications.png" width={20} />
                    <Text marginTop={4}>
                        Is this what inner peace feels like?
                    </Text>
                </Flex>
            ) : (
                <></>
            )}
        </Container>
    );
};

export default NotificationList;
