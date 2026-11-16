import { Conversation } from "@/models/message.model";
import { safeFormat } from "@/utils/date";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ConversationTab = ({
  msg,
  usrId,
}: {
  msg: Conversation;
  usrId: string;
}) => {
  const router = useRouter();

  const showMsg = () => {
    router.push(`/message/${msg._id}`);
  };

  return (
    <li
      onClick={showMsg}
      className="bg-white w-full shadow-md shadow-gray text-black hover:bg-orange hover:bg-opacity-10 transition rounded-md my-3 cursor-pointer overflow-hidden flex items-center justify-between p-4"
    >
      <div>
        <h3 className="font-semibold text-lg mb-1 text-orange">
          {msg.rId == usrId && msg.usrName}
          {msg.usrId == usrId && msg.rName}
        </h3>
        {msg.lastMsg != undefined && (
          <p className="text-xs font-medium text-black">
            <strong className="text-darkGray">Last Message On:</strong>{" "}
            {safeFormat(msg.lastMsg, "dd-MM-yyyy hh:mm a")}
          </p>
        )}
        {msg.lastMsg == undefined && (
          <p className="text-sm font-medium text-black">No Message Sent Yet!</p>
        )}
      </div>
      <div>
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          x="0px"
          y="0px"
          width="535.5px"
          height="535.5px"
          viewBox="0 0 535.5 535.5"
          enableBackground="new 0 0 535.5 535.5"
          className="w-8 h-8 fill-orange"
        >
          <g>
            <g id="send">
              <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75 		" />
            </g>
          </g>
        </svg>
      </div>
    </li>
  );
};

export default ConversationTab;
