import { cx } from "@emotion/css";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import Button from "../../components/Button";
import { ExplorerIcon } from "../../components/icons";
import Workspace from "../../components/Workspace/Workspace";
import {
  useConfiguration,
  useWithTheme,
  withClassNamePrefix,
} from "../../core";
import {
  activeConfigurationAtom,
  configurationAtom,
} from "../../core/StateProvider/configuration";
import useSchemaSync from "../../hooks/useSchemaSync";

export type ConnectionsProps = {
  classNamePrefix?: string;
};


const SetConnections = ({ classNamePrefix = "ft" }: ConnectionsProps) => {
  const styleWithTheme = useWithTheme();
  const pfx = withClassNamePrefix(classNamePrefix);

  const config = useConfiguration();
  const activeConfig = useRecoilValue(activeConfigurationAtom);
  const configuration = useRecoilValue(configurationAtom);
  const [isModalOpen, setModal] = useState(configuration.size === 0);
  const [isSyncing, setSyncing] = useState(false);
  const [screenState, setScreenState] = useState()

  const updateSchema = useSchemaSync(setSyncing);
  useEffect(() => {
    if (config?.schema?.triedToSync === true) {
      return;
    }
    updateSchema();
  }, [activeConfig, config?.schema?.triedToSync, updateSchema]);

  return null;
};

export default SetConnections;
