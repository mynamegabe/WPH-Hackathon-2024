"use client";

import { title } from "@/components/primitives";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Select, SelectSection, SelectItem } from "@nextui-org/select";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Chip } from "@nextui-org/chip";
import { Link } from "@nextui-org/link";
import { Divider } from "@nextui-org/divider";
import { useState, useEffect } from "react";
import { RefreshCcw, Search, Upload } from "lucide-react";
import { Button } from "@nextui-org/button";
import {
  getUser,
  getForms,
  matchUserRoles,
  uploadVideo,
  getUserVideos,
} from "@/utils/api";
import { siteConfig } from "@/config/site";

export default function UserPage({
  params,
}: {
  params: {
    userId: string;
  };
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [user, setUser] = useState([]);
  const [matchedRoles, setMatchedRoles] = useState([]); // [1
  const [forms, setForms] = useState([]);
  const [video, setVideo] = useState<File>();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    getUser(params.userId).then((response) => {
      setUser(response.user);
      setMatchedRoles(response.matched_roles);
    });
    getForms().then((response) => {
      setForms(response);
    });
    getUserVideos(params.userId).then((response) => {
      setVideos(response);
    });
  }, []);

  const fileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files[0];
    onOpen();
    setVideo(file);
  };

  const doUpload = (onClose) => {
    uploadVideo(video, params.userId).then((response) => {
      onClose();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className={title({ highlight: true })}>User</h1>

      <div className="flex flex-row gap-4 flex-wrap overflow-y-auto">
        <Card
          className={`bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50 w-full`}
        >
          <CardBody
            className={`flex flex-row gap-4 w-full px-4 py-8 items-stretch overflow-hidden`}
          >
            <div className="flex flex-col gap-4 items-center w-56">
              <img
                src={siteConfig.apiUrl + "/uploads/avatars/" + user.image}
                alt={user.first_name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <p className="font-semibold">
                {user.first_name} {user.last_name}
              </p>
              <p
                className="text-sm max-h-16 text-ellipsis overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {user.description}
              </p>
              <div className="flex flex-col gap-2 w-full">
                <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">
                  Traits
                </p>
                <div className="flex flex-row content-start gap-4 w-full flex-wrap h-32 overflow-y-auto">
                  {user.traits?.split(",").map((trait, index) => {
                    return (
                      <Chip key={index} color="primary">
                        {trait}
                      </Chip>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center gap-2 w-full">
                <Button color="warning" variant="solid" onClick={onOpen}>
                  Check video
                </Button>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Check video
                        </ModalHeader>
                        <ModalBody>
                          <div className="border-[1px] border-textPrimary/50 rounded-md h-32 relative hover:bg-bgSecondary/50 transition-colors">
                            <input
                              type="file"
                              className="h-full w-full opacity-0 cursor-pointer"
                              onChange={fileChange}
                            />
                            <p className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-textPrimary/50 flex flex-col items-center gap-2 cursor-pointer">
                              <Upload size={24} />
                              <span>{video ? video.name : "Upload video"}</span>
                            </p>
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            color="primary"
                            onPress={(e) => doUpload(onClose)}
                          >
                            Send
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
            </div>
            <Divider orientation="vertical" className="!h-auto" />
            <div className="flex flex-col gap-4 grow justify-between">
              <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between items-center gap-4">
                  <p className="font-semibold">Matched Roles</p>
                  <Button onClick={() => matchUserRoles(user.id)}>
                    <RefreshCcw size={20} />
                  </Button>
                </div>
                <div className="flex flex-col gap-4">
                  {matchedRoles
                    .filter((match) => match.user_id === user.id)
                    .map((match, index) => {
                      return (
                        <Chip
                          key={index}
                          color="success"
                          as={Link}
                          href={`/role/${match.role_id}`}
                        >
                          {match.role}
                        </Chip>
                      );
                    })}
                </div>
              </div>
              <div className="flex flex-row gap-4">
                <Button
                  color="primary"
                  variant="solid"
                  as={Link}
                  href={siteConfig.apiUrl + "/user/" + user.id + "/resume"}
                >
                  Resume
                </Button>
                <Button
                  color="primary"
                  variant="solid"
                  as={Link}
                  href={siteConfig.apiUrl + "/user/" + user.id + "/report"}
                >
                  Report
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>
        <h2 className="text-lg font-semibold">Videos</h2>
        {videos.map((video, index) => {
          return (
            <Card
              key={index}
              className="bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50 w-full"
            >
              <CardBody className="flex flex-row gap-4 w-full px-4 py-8 items-stretch overflow-hidden">
                <div className="flex gap-4 items-center">
                  <video
                    src={siteConfig.apiUrl + "/uploads/videos/" + video.filename}
                    controls
                    className="w-56 h-32"
                  />
                  <div className="flex flex-col gap-2">
                    <p className="font-semibold">Eye tracking</p>
                    <p className="text-sm">Left: {(video.left / (video.left + video.right) * 100).toFixed(2)}%</p>
                    <p className="text-sm">Right: {(video.right / (video.left + video.right) * 100).toFixed(2)}%</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
