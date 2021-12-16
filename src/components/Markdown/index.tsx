import React from "react"
import ReactMarkdown from "react-markdown"
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Prism } from "react-syntax-highlighter"

const components = {
    code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "")
        return !inline && match ? (
            <Prism
             style={tomorrow}
             language={match[1]}
             PreTag="div"
             children={String(children).replace(/\n$/, "")}
             {...props}
            />
        ) : (
            <code className={className} {...props} />
        )
    }
}

const Markdown: React.FC = ({ children }) => {
    return (
        <ReactMarkdown className="nofix" components={components}>
            {children as string}
        </ReactMarkdown>
    )
}

export default Markdown