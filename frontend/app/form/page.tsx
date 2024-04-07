"use client";

import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { Input, Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

import { getForm, submitForm, startConversation, submitConversation } from "@/utils/api";
import { useState, useEffect } from "react";

export default function FormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({});
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formStatus, setFormStatus] = useState("idle");
  const [conversationInput, setConversationInput] = useState("");
  const [conversationFields, setConversationFields] = useState([]);

  const onChange = (index: number, value: string) => {
    console.log(index, value);
    let newFields = fields;
    newFields[index]["value"] = value;
    setFields(newFields);
  };

  const onSubmit = () => {
    setFormLoading(true);
    submitForm(form.id, fields).then((response) => {
      setFormLoading(false);
      setFormStatus("success");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    });
  };

  const onConversationSubmit = () => {
    setFormLoading(true);
    let mergedFields = [{ question: fields[0].description, reply: conversationInput }, ...conversationFields]
    submitConversation(form.id, conversationFields).then((response) => {
      setFormLoading(false);
      setFormStatus("success");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    });
  }

  useEffect(() => {
    async function getLoader() {
      const { miyagi } = await import("ldrs");
      miyagi.register();
    }
    getLoader();
    const formId = searchParams.get("id");
    getForm(formId).then((response) => {
      setForm(response.form);
      setFields(response.fields);
    });
  }, []);

  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 w-full">
      {loading ? (
        <l-miyagi
          size="35"
          stroke="3.5"
          speed="0.9"
          color="hsl(var(--nextui-textPrimary) / var(--nextui-textPrimary-opacity, var(--tw-text-opacity)))"
        ></l-miyagi>
      ) : (
        <div className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <h1 className={title({ highlight: true })}>{form.name}</h1>
            <h2 className={subtitle({ class: "mt-4" })}>{form.description}</h2>
          </div>
          {fields.map((field, index) => {
            return (
              !form.conversational && (
                <div key={index} className="flex flex-col gap-2 w-full">
                  <p className="font-semibold">{field.description}</p>
                  <Textarea
                    variant="faded"
                    type={field.type}
                    placeholder={field.placeholder}
                    onChange={(e) => onChange(index, e.target.value)}
                  />
                </div>
              )
            );
          })}
          {form.conversational && (
            <div className="flex flex-col gap-2 w-full">
              <p className="font-semibold">{fields[0].description}</p>
              <div className="flex items-center gap-4">
                <Textarea
                  variant="faded"
                  size="sm"
                  type={fields[0].type}
                  placeholder={fields[0].placeholder}
                  onChange={(e) => setConversationInput(e.target.value)}
                />
                <Button
                  className={`${buttonStyles({
                    color: "primary",
                    // radius: "full",
                    variant: "shadow",
                  })}`}
                  onClick={() => {
                    startConversation(form.id, {
                      question: fields[0].description,
                      reply: conversationInput,
                    }).then((response) => {
                      let newFields = conversationFields.slice();
                      newFields.push(response);
                      setConversationFields(newFields);
                    });
                  }}
                >
                  Send
                </Button>
              </div>
            </div>
          )}

          {form.conversational && (
            <div className="flex flex-col gap-4 w-full">
              {conversationFields.map((field, index) => {
                return (
                  <div key={index} className="flex flex-col gap-2 w-full">
                    <p className="font-semibold">{field.question}</p>

                    <div className="flex gap-2 w-full">
                      <Textarea
                        variant="faded"
                        size="sm"
                        type="text"
                        value={conversationFields[index].reply}
                        onChange={(e) => {
                          let newFields = conversationFields.slice();
                          newFields[index].reply = e.target.value;
                          setConversationFields(newFields);
                        }}
                      />
                      {index < form.max_responses - 1 && (
                      <Button
                        className={`${buttonStyles({
                          color: "primary",
                          // radius: "full",
                          variant: "shadow",
                        })}`}
                        onClick={() => {
                          startConversation(form.id, {
                            question: field.question,
                            reply: field.reply,
                          }).then((response) => {
                            let newFields = conversationFields.slice();
                            newFields.push(response);
                            setConversationFields(newFields);
                          });
                        }}
                      >
                        Reply
                      </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!form.conversational && (
          <Button
            className={`${buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })} 
                        ${formStatus === "success" ? "bg-success" : ""}
                        `}
            onClick={() => onSubmit()}
            isLoading={formLoading}
          >
            {formStatus === "success" ? (
              <CheckCircle2 size={24} className="mr-2" />
            ) : (
              "Submit"
            )}
          </Button>
          )}
          {form.conversational && form.max_responses <= conversationFields.length && (
            <Button
              className={`${buttonStyles({
                color: "primary",
                radius: "full",
                variant: "shadow",
              })}`}
              onClick={() => onConversationSubmit()}
              isLoading={formLoading}
            >
              {formStatus === "success" ? (
                <CheckCircle2 size={24} className="mr-2" />
              ) : (
                "Submit"
              )}
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
