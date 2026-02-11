// Copyright 2026 nnthanh101@gmail.com (oceansoft.io). Based on Innovation Sandbox on AWS by Amazon.com, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useAppLayoutContext } from "@aws-northstar/ui/components/AppLayout";
import { ImInfo } from "react-icons/im";

import { Markdown } from "sandbox-frontend/components/Markdown";
import { TextLink } from "sandbox-frontend/components/TextLink";

import styles from "./styles.module.scss";

interface InfoLinkProps {
  text?: string;
  markdown: string;
}

export const InfoLink = ({ text, markdown }: InfoLinkProps) => {
  const { setTools, setToolsOpen, setToolsHide } = useAppLayoutContext();

  const onClick = () => {
    setTools(<Markdown file={markdown} />);
    setToolsHide(false);
    setToolsOpen(true);
  };

  return (
    <TextLink onClick={onClick}>
      <div className={styles.container}>
        <ImInfo size={18} />
        {text && <span className={styles.text}>{text}</span>}
      </div>
    </TextLink>
  );
};
