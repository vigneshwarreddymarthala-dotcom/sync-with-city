import { Messages } from "@/models/message.model";
import { safeFormat } from "@/utils/date";

const MessageTab = ({ msg, usrId }: { msg: Messages; usrId: String }) => {
  return (
    <li className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden p-4">
      <h3 className="font-semibold text-lg text-orange">
        {msg.senderId == usrId && <>You</>}

        {msg.senderId != usrId && <>{msg.senderName}</>}
      </h3>

      <p className="text-base text-black msgBox">
        <span dangerouslySetInnerHTML={{ __html: msg.message }}></span>
        <br />
        <small className="text-xs text-darkGray font-medium">
          Sent on: {safeFormat(msg.createdAt, "dd-MM-yyyy hh:mm a")}
        </small>
      </p>
    </li>
  );
};

export default MessageTab;
