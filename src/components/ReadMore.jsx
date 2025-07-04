import { useState } from "react";
const ReadMore = ({ text, maxLength }) => {
    const [isExpand, setIsExpand] = useState(false);
    const toggleReadMore = () => {
        setIsExpand((prev) => !prev);
    };
    const displayText = isExpand ? text : text.slice(0, maxLength) + (text.length > maxLength ? "..." : "");
    return (
        <div className="text-gray-100">
            <span>{displayText}</span>
            {text.length > maxLength && (
                <button onClick={toggleReadMore} className="ml-2 cursor-pointer hover:underline">{isExpand ? "Show Less" : "Read More"}</button>
            )}
        </div>
    )
}
export default ReadMore