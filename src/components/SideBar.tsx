import { INavLinkGroup, INavStyles, Nav } from "@fluentui/react";

function SideBar() {
  const navLinkGroups: INavLinkGroup[] = [
    {
      links: [
        {
          name: "Home",
          url: "http://example.com",
          expandAriaLabel: "Expand Home section",
          collapseAriaLabel: "Collapse Home section",
          links: [
            {
              name: "Activity",
              url: "http://msn.com",
              key: "key1",
              target: "_blank",
            },
            {
              name: "MSN",
              url: "http://msn.com",
              key: "key2",
              target: "_blank",
            },
          ],
          isExpanded: true,
        },
        {
          name: "Documents",
          url: "http://example.com",
          key: "key3",
          isExpanded: true,
          target: "_blank",
        },
        {
          name: "Pages",
          url: "http://msn.com",
          key: "key4",
          target: "_blank",
        },
        {
          name: "Notebook",
          url: "http://msn.com",
          key: "key5",
        },
        {
          name: "Communication and Media",
          url: "http://msn.com",
          key: "key6",
          target: "_blank",
        },
        {
          name: "News",
          url: "http://cnn.com",
          icon: "News",
          key: "key7",
          target: "_blank",
        },
      ],
    },
  ];

  const navStyles: Partial<INavStyles> = {
    root: {
      width: 208,
      height: "100vh",
      boxSizing: "border-box",
      border: "1px solid #eee",
      overflowY: "auto",
      backgroundColor: "#fafafa",
    },
  };
  return (
    <Nav
      // onLinkClick={_onLinkClick}
      selectedKey="key3"
      ariaLabel="Nav basic example"
      styles={navStyles}
      groups={navLinkGroups}
    />
  );
}
export default SideBar;
