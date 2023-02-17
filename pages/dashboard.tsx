import SideBar from "@components/SideBar";
import NewProject from "@components/NewProject";
import {
    Button,
    Flex,
    Image,
    Input,
    Spinner,
    Text,
} from "@pankod/refine-chakra-ui";
import { rise } from "animations";
import { Suspense, useEffect, useState } from "react";
import { teams } from "src/utility";
import { Plus } from "react-feather";
import { AnimatePresence, motion } from "framer-motion";
import ExtraBold from "@components/ExtraBold";
import Bold from "@components/Bold";
import { Models } from "@pankod/refine-appwrite";
import ProjectCard from "@components/ProjectsCard";

const DashBoard = () => {
    const date = new Date();
    const [user_teams, set_user_teams] = useState<Array<Models.Team>>();
    const [show_new, set_show_new] = useState<boolean>(false);
    const [loading, set_loading] = useState<boolean>(false);
    const [refresh, set_refresh] = useState<boolean>(true);

    useEffect(() => {
        if (!refresh) return;

        const fetchTeams = async () => {
            set_loading(true);
            set_user_teams((await teams.list()).teams);
            set_loading(false);
        };

        fetchTeams();

        set_refresh(false);
    }, [refresh]);

    // Create an array full of month's name
    const month = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const Container = motion(Flex);
    const AnimatedElement = motion(Flex);

    return (
        <Flex width={"100vw"} height="100vh">
            <SideBar current="dashboard" />
            <AnimatePresence initial={true}>
                {show_new && (
                    <NewProject
                        container={Container}
                        afterAll={() => set_refresh(true)}
                        animatedelement={AnimatedElement}
                        destroy_self={() => set_show_new(false)}
                    />
                )}
            </AnimatePresence>
            <Flex
                direction={"column"}
                width={{
                    sidebar_md: "calc(100vw - 350px)",
                    sm: "calc(100vw - 100px)",
                    base: "calc(100vw)",
                }}
                height="fit-content"
                paddingTop={32}
                paddingLeft={{ sidebar_md: 12, sm: 8, base: 4 }}
                paddingRight={{ sidebar_md: 12, sm: 0, base: 4 }}
                marginLeft={{ sidebar_md: "350px", sm: "80px", base: "0px" }}
            >
                <ExtraBold
                    fontSize={28}
                    opacity={0}
                    style={{ animationDelay: "140ms" }}
                    animation={`${rise} 500ms ease-in-out forwards`}
                >
                    Today, {date.getDate()} {month[date.getMonth()]}
                </ExtraBold>
                <Flex
                    width="full"
                    marginTop={3}
                    gap={4}
                    opacity={0}
                    style={{ animationDelay: "140ms" }}
                    animation={`${rise} 500ms ease-in-out forwards`}
                >
                    <Input
                        placeholder="Searching for..."
                        bg="#dde0f2"
                        padding={6}
                        opacity={0}
                        style={{ animationDelay: "160ms" }}
                        animation={`${rise} 500ms ease-in-out forwards`}
                        _placeholder={{ color: "gray.500" }}
                    />
                    {/* Create new project button */}
                    <Button
                        bg="#2E3440"
                        color="#d2d8f3"
                        padding={6}
                        opacity={0}
                        style={{ animationDelay: "180ms" }}
                        animation={`${rise} 500ms ease-in-out forwards`}
                        width={"300px"}
                        display={{ sm: "inherit", base: "none" }}
                        onClick={() => set_show_new(true)}
                        _hover={{ bg: "#2E3440" }}
                    >
                        Create new project
                    </Button>
                    {/* Plus sign on small screens */}
                    <Button
                        bg="#2E3440"
                        color="#d2d8f3"
                        display={{ base: "inherit", sm: "none" }}
                        padding={6}
                        opacity={0}
                        style={{ animationDelay: "180ms" }}
                        animation={`${rise} 500ms ease-in-out forwards`}
                        width={"80px"}
                        onClick={() => set_show_new(true)}
                        _hover={{ bg: "#2E3440" }}
                    >
                        <Plus />
                    </Button>
                </Flex>
                <Bold
                    marginTop={6}
                    opacity={0}
                    style={{ animationDelay: "200ms" }}
                    animation={`${rise} 500ms ease-in-out forwards`}
                    fontSize={16}
                >
                    Recent Projects
                </Bold>
                <Flex marginTop={4} gap={6} wrap="wrap">
                    {user_teams ? (
                        user_teams.map((team) => {
                            return (
                                <ProjectCard
                                    id={team.$id}
                                    key={team.$id}
                                    name={team.name}
                                />
                            );
                        })
                    ) : !loading && !refresh ? (
                        <Flex
                            height="50vh"
                            width="full"
                            direction="column"
                            alignItems={"center"}
                            justifyContent="center"
                        >
                            <Image
                                src="/images/empty.png"
                                width={24}
                                height={24}
                                alt="Empty state"
                            />
                            <Text marginTop={4}>
                                When you realize there are no projects to work
                                on and it&apos;s only Monday.
                            </Text>
                        </Flex>
                    ) : (
                        <></>
                    )}
                    {loading ? (
                        <Flex
                            width="full"
                            height="50vh"
                            alignItems="center"
                            justifyContent={"center"}
                        >
                            <Spinner color="#2E3440" />
                        </Flex>
                    ) : (
                        <></>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
};

export default DashBoard;
