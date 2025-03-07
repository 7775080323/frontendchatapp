
// import ConversationsList from "./ConversationsList"
// import Search from "./Search"
import Toggle from "./Toggle"
import { ToggleProps } from "@/types"
type PropTypes = ToggleProps

const Conversation = ({toggleSidebar}: PropTypes) => {
  return (
    <div>
    
      <div className="ml-4 mt-3">
        <Toggle toggleSidebar={toggleSidebar} />
      </div>
        {/* <Search /> */}
        {/* <ConversationsList /> */}
    </div>
  )
}

export default Conversation