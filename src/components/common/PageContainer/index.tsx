import React, { ReactNode } from "react";
import "./index.scss";

interface PageContainerProps {
  title?: string;
  extra?: ReactNode;
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({
  title,
  extra,
  children,
}) => {
  return (
    <div className="page-container">
      {(title || extra) && (
        <div className="page-container-header">
          {title && <h1 className="page-container-title">{title}</h1>}
          {extra && <div className="page-container-extra">{extra}</div>}
        </div>
      )}
      <div className="page-container-content">{children}</div>
    </div>
  );
};

export default PageContainer;
