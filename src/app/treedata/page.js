
"use client"
import React, { useState } from "react";

function ShowData({ node, onCheckChange, margin = 10 }) {
  const [show, setShow] = useState(false);

  const handleCheck = (event) => {
    const isChecked = event.target.checked;
    onCheckChange(node, isChecked);
  };

  const toggleShow = () => {
    setShow(!show);
  };

  return (
    <div style={{ marginLeft: margin, padding: "5px" }}>
      <div className="flex gap-2 items-center">
        <input
          type="checkbox"
          checked={node.isChecked}
          onChange={handleCheck}
        />
        <h1
          onClick={toggleShow}
          style={{ cursor: "pointer" }}
        >
          {node.name}{node.children && node.children.length > 0 ? show ? "❌" : "➡️" : ""}
        </h1>
      </div>
      {show && node.children && node.children.map((child, index) => (
        <ShowData
          key={child.id}
          node={child}
          onCheckChange={onCheckChange}
          margin={margin + 10}
        />
      ))}
    </div>
  );
}

const buildParentObject = (nodes, parentObj = {}) => {
  nodes.forEach((node) => {
    node.children?.forEach((child) => {
      parentObj[child.id] = node;
    });
    buildParentObject(node.children, parentObj);
  });
  return parentObj;
};

const updateChildren = (node, isChecked) => {
  node.isChecked = isChecked;
  node.children?.forEach((child) => updateChildren(child, isChecked));
};

const updateParents = (node, parentObj) => {
  const parent = parentObj[node.id];
  console.log(parent);
  if (parent) {
    parent.isChecked = parent.children.every((child) => child.isChecked);
    updateParents(parent, parentObj);
  }
};



let idCounter = 0;
function Id() {
  return idCounter++
}

function initializeTreeData(nodes) {
  return nodes.map((node) => ({
    ...node,
    isChecked: false,
    id:Id(),
    children: node.children ? initializeTreeData(node.children) : [],
  }));
}

export default function TreeComponent() {
  const initialData = [
    {
      name: "Parent 1",
      children: [
        {
          name: "Child 1",
          children: [
            {
              name: "Grandchild 1",
              children: [
                { name: "Great Grandchild 1", children: [
                  { name: "Great Great Grandchild 1", children: [] },
                  { name: "Great Great Grandchild 2", children: [] },
                ] },
                { name: "Great Grandchild 2", children: [] },
                { name: "Great Grandchild 3", children: [] },
              ],
            },
            { name: "Grandchild 2", children: [] },
          ],
        },
        {
          name: "Child 2",
          children: [
            { name: "Grandchild 1", children: [] },
            { name: "Grandchild 2", children: [] },
          ],
        },
      ],
    },
  ];

  const [treeData, setTreeData] = useState(initializeTreeData(initialData));

  const handleCheckChange = (node, isChecked) => {
    const parentObj = buildParentObject(treeData);
    updateChildren(node, isChecked);
    updateParents(node, parentObj);
    setTreeData([...treeData]);
  };

  return (
    <div style={{ padding: "20px" }} className="flex flex-col justify-center items-center">
      {treeData.map((node) => (
        <ShowData
          key={node.id}
          node={node}
          onCheckChange={handleCheckChange}
          margin={0}
        />
      ))}
    </div>
  );
}
