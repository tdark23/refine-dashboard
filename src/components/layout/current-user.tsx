import { Popover, Button } from "antd";
import CustomAvatar from '../custom-avatar'
import { useGetIdentity } from "@refinedev/core";

import type { User } from '@/graphql/schema.type'

const CurrentUser = () => {
  const { data: user } = useGetIdentity<User>()
  return (
    <>
      <Popover
        placement="bottomRight"
        trigger="click"
        content={<div style={{ padding: 0, zIndex: 999 }}>Test</div>}
      >
        <CustomAvatar name=""/>
      </Popover>
    </>
  );
};

export default CurrentUser;
