const LinkComponent = ({ href, query, children }) => {
  return (
    <a
      rel="canonical"
      href={`${href}${
        query?.param1 != undefined ? "?param1=" + query.param1 : ""
      }`}
    >
      {children}
    </a>
  );
};
export default LinkComponent;
