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
import { RefreshCcw, Search } from "lucide-react";
import { Button } from "@nextui-org/button";
import { getApplicants, getForms, sendForm, matchUserRoles } from "@/utils/api";
import { siteConfig } from "@/config/site";
import { set } from "react-hook-form";

export default function ApplicantsPage({
  params,
}: {
  params: {
    roleId: string;
  };
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [applicants, setApplicants] = useState([]);
  const [matchedRoles, setMatchedRoles] = useState([]); // [1
  const [activeApplicant, setActiveApplicant] = useState(-1);
  const [forms, setForms] = useState([]);
  const [selectedForm, setSelectedForm] = useState("");

  useEffect(() => {
    getApplicants(params.roleId).then((response) => {
      setApplicants(response.applicants);
      setMatchedRoles(response.matched_roles); 
    });
    getForms().then((response) => {
      setForms(response);
    });
  }, []);

  const doSend = (userId, onClose) => {
    sendForm(selectedForm, userId).then(() => {
      onClose();
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h1 className={title({ highlight: true })}>Applicants</h1>
      <div className="flex flex-row gap-4 w-full">
        <Card className="bg-bgSecondary/80 shadow-none border-[1px] border-textPrimary/50">
          <CardBody className="w-28 flex-col items-center gap-2">
            <p className="font-semibold">Users</p>
            <p className="text-3xl">{applicants.length}</p>
          </CardBody>
        </Card>
      </div>

      <Input
        type="text"
        label="Search"
        placeholder="Search for applicants"
        startContent={<Search size={20} />}
      />

      <div className="flex flex-row gap-4 flex-wrap overflow-y-auto">
        {applicants.map((applicant, index) => {
          return (
            <Card
              key={index}
              className={`bg-bgSecondary/80 shadow-none w-64 !transition-all border-[1px] border-textPrimary/50 max-w-[30rem] ${
                activeApplicant === index ? "w-full" : ""
              }`}
              onPress={() => {
                if (activeApplicant === index) {
                  setActiveApplicant(-1);
                } else {
                  setActiveApplicant(index);
                }
              }}
              isPressable
              isHoverable
            >
              <CardBody
                className={`flex flex-row gap-4 w-full px-4 py-8 items-stretch overflow-hidden`}
              >
                <div className="flex flex-col gap-4 items-center w-56">
                  <img
                    src={applicant.image}
                    alt={applicant.first_name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <p className="font-semibold">
                    {applicant.first_name} {applicant.last_name}
                  </p>
                  <p
                    className="text-sm max-h-16 text-ellipsis overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {applicant.description}
                  </p>
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-sm text-left w-full text-textPrimary/80 font-semibold">
                      Traits
                    </p>
                    <div className="flex flex-row content-start gap-4 w-full flex-wrap h-32 overflow-y-auto">
                      {applicant.traits?.split(",").map((trait, index) => {
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
                      Send assessment
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                      <ModalContent>
                        {(onClose) => (
                          <>
                            <ModalHeader className="flex flex-col gap-1">
                              Send an assessment
                            </ModalHeader>
                            <ModalBody>
                              <Select
                                placeholder="Select form"
                                className="w-full"
                                onChange={(e) =>
                                  setSelectedForm(e.target.value)
                                }
                              >
                                {forms.map((form, index) => {
                                  return (
                                    <SelectItem key={form.id} value={form.id}>
                                      {form.name}
                                    </SelectItem>
                                  );
                                })}
                              </Select>
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
                                onPress={(e) => doSend(applicant.id, onClose)}
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
                {activeApplicant === index && (
                  <>
                    <Divider orientation="vertical" className="!h-auto" />
                    <div className="flex flex-col gap-4 grow justify-between">
                      <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-between items-center gap-4">
                          <p className="font-semibold">Matched Roles</p>
                          <Button onClick={() => matchUserRoles(applicant.id)}>
                            <RefreshCcw size={20} />
                          </Button>
                        </div>
                        <div className="flex flex-col gap-4">
                          {matchedRoles.filter((match) => match.user_id === applicant.id).map((match, index) => {
                            return (
                              <Chip key={index} color="success" as={Link} href={`/role/${match.role_id}`}>
                                {match.role}
                              </Chip>
                            );
                          })}
                          {/* <Button color="default">Project Manager</Button>
                                                        <Button color="default">Product Manager</Button> */}
                        </div>
                      </div>
                      <div className="flex flex-col gap-4">
                        <Button
                          color="primary"
                          variant="solid"
                          as={Link}
                          href={siteConfig.apiUrl + "/profile/resume"}
                        >
                          Download Resume
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
