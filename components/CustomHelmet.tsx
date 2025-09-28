import React, { useEffect } from 'react';

interface CustomHelmetProps {
  children?: React.ReactNode;
  prioritizeSeoTags?: boolean;
}

const CustomHelmet: React.FC<CustomHelmetProps> = ({ children, prioritizeSeoTags = false }) => {
  useEffect(() => {
    if (!children) return;

    const elements: { type: string; props: any }[] = [];

    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child)) {
        elements.push({ type: child.type as string, props: child.props });
      }
    });

    const addedElements: HTMLElement[] = [];

    elements.forEach(({ type, props }) => {
      if (type === 'title') {
        document.title = props.children;
      } else if (type === 'meta') {
        const meta = document.createElement('meta');
        Object.keys(props).forEach(key => {
          if (key !== 'children') {
            meta.setAttribute(key, props[key]);
          }
        });
        document.head.appendChild(meta);
        addedElements.push(meta);
      } else if (type === 'link') {
        const link = document.createElement('link');
        Object.keys(props).forEach(key => {
          if (key !== 'children') {
            link.setAttribute(key, props[key]);
          }
        });
        document.head.appendChild(link);
        addedElements.push(link);
      } else if (type === 'script') {
        const script = document.createElement('script');
        Object.keys(props).forEach(key => {
          if (key !== 'children') {
            script.setAttribute(key, props[key]);
          }
        });
        if (props.children) {
          script.textContent = props.children;
        }
        document.head.appendChild(script);
        addedElements.push(script);
      } else if (type === 'html') {
        const html = document.documentElement;
        Object.keys(props).forEach(key => {
          if (key !== 'children') {
            html.setAttribute(key, props[key]);
          }
        });
      }
    });

    return () => {
      addedElements.forEach(el => {
        if (el.parentNode) el.parentNode.removeChild(el);
      });
    };
  }, [children]);

  return null;
};

export default CustomHelmet;