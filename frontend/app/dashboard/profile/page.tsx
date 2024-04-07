"use client";

import { title } from "@/components/primitives";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { button as buttonStyles } from "@nextui-org/theme";
import { CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Button } from "@nextui-org/button";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { getProfile, uploadResume, uploadAvatar, updateUserDescription } from "@/utils/api";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Textarea } from "@nextui-org/input";

export default function ApplicantsPage() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isAvatarOpen,
    onOpen: onAvatarOpen,
    onOpenChange: onAvatarOpenChange,
  } = useDisclosure();
  const [user, setUser] = useState({});
  const [avatar, setAvatar] = useState<File>();
  const [resume, setResume] = useState<File>();
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");

  const fileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files[0];
    onOpen();
    setResume(file);
  };

  const avatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let file = event.target.files[0];
    // onAvatarOpen();
    setAvatar(file);
  };

  const doUpload = (onClose) => {
    setFormLoading(true);
    uploadResume(resume).then((response) => {
      setFormLoading(false);
      setFormStatus("success");
      setTimeout(() => {
        onClose();
      }, 2000);
    });
  };

  const doAvatarUpload = (onClose) => {
    setFormLoading(true);
    uploadAvatar(avatar).then((response) => {
      setFormLoading(false);
      setFormStatus("success");
      setTimeout(() => {
        onClose();
      }, 2000);
    });
  };

  useEffect(() => {
    getProfile().then((response) => {
      setUser(response);
    });
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className={title({ highlight: true })}>Profile</h1>
      <div className="flex flex-col gap-4 w-full">
        <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50">
          <CardBody className="min-w-96 flex-col items-center gap-2 py-8 px-4">
            <img
              src={siteConfig.apiUrl + "/uploads/avatars/" + user.image}
              alt="Profile Picture"
              className="w-20 h-20 rounded-full object-cover hover:brightness-75 transition-all cursor-pointer"
              onClick={() => onAvatarOpen()}
            />
            <p className="font-semibold">
              {user.first_name} {user.last_name}
            </p>
            {/* <p>{user.description}</p> */}
            <Textarea
              label="Description"
              placeholder="Tell us about yourself"
              value={user.description}
              onChange={(e) =>
                setUser({ ...user, description: e.target.value })
              }
            />
            <p className="text-sm text-left w-full text-textPrimary/50 flex gap-2">
              Age <span className="text-textSecondary">{user.age}</span>
            </p>
            <p className="text-sm text-left w-full text-textPrimary/50 flex gap-2">
              Phone{" "}
              <span className="text-textSecondary">{user.phone_number}</span>
            </p>
            <p className="text-sm text-left w-full text-textPrimary/50 flex gap-2">
              Email <span className="text-textSecondary">{user.email}</span>
            </p>
            <Button
              color="primary"
              onPress={() => {
                updateUserDescription(user.description);
              }}
              className="w-full"
            >
              Update
            </Button>
          </CardBody>
        </Card>
      </div>
      <div className="border-[1px] border-textPrimary/50 rounded-md h-32 relative hover:bg-bgSecondary/50 transition-colors">
        <input
          type="file"
          className="h-full w-full opacity-0 cursor-pointer"
          onChange={fileChange}
          accept="application/pdf"
        />
        <p className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-textPrimary/50 flex flex-col items-center gap-2 cursor-pointer">
          <Upload size={24} />
          <span>Upload a new resume</span>
        </p>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Resume
              </ModalHeader>
              <ModalBody>
                <p>
                  You are about to upload{" "}
                  <span className="bold">{resume?.name}</span>
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                {/* <Button color="primary" onPress={doUpload}>
                            Upload
						</Button> */}
                <Button
                  className={`${buttonStyles({
                    color: "primary",
                    radius: "full",
                    variant: "shadow",
                  })} 
                        ${formStatus === "success" ? "bg-success" : ""}
                        `}
                  onPress={() => doUpload(onClose)}
                  isLoading={formLoading}
                >
                  {formStatus === "success" ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal isOpen={isAvatarOpen} onOpenChange={onAvatarOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Upload Profile Image
              </ModalHeader>
              <ModalBody>
                <div className="border-[1px] border-textPrimary/50 rounded-md h-32 relative hover:bg-bgSecondary/50 transition-colors">
                  <input
                    type="file"
                    className="h-full w-full opacity-0 cursor-pointer"
                    onChange={avatarChange}
                    accept="image/*"
                  />
                  <p className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-textPrimary/50 flex flex-col items-center gap-2 cursor-pointer">
                    <Upload size={24} />
                    <span>
                      {avatar ? avatar.name : "Upload a new profile image"}
                    </span>
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  className={`
                  ${buttonStyles({
                    color: "primary",
                    radius: "full",
                    variant: "shadow",
                  })} 
                  ${formStatus === "success" ? "bg-success" : ""}
                `}
                  onPress={() => doAvatarUpload(onClose)}
                  isLoading={formLoading}
                >
                  {formStatus === "success" ? (
                    <CheckCircle2 size={24} />
                  ) : (
                    "Upload"
                  )}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Button
        color="primary"
        variant="solid"
        as={Link}
        href={siteConfig.apiUrl + "/profile/resume"}
      >
        Download Resume
      </Button>
    </div>
  );
}
