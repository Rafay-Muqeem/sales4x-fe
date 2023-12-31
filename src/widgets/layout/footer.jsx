import PropTypes from "prop-types";
import { Typography } from "@material-tailwind/react";

export function Footer({ routes }) {
  const year = new Date().getFullYear();

  return (
    <footer 
    className="z-40 xl:ml-72 sm:ml-2 text-blue-gray-600 py-6 sticky bottom-0 bg-white"
    //  className="xl:ml-80 sm:ml-2 text-blue-gray-600 py-6 sticky bottom-0 bg-white"
     >
      <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
        <ul className="flex items-center gap-4">
          {routes.map(({ name, path }) => (
            <li key={name}>
              <Typography
                as="a"
                href={path}
                target="_blank"
                variant="small"
                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-black"
              >
                {name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

Footer.defaultProps = {
  routes: [
    { name: "About Us", path: "https://www.creative-tim.com/presentation" },
    { name: "Blog", path: "https://www.creative-tim.com/blog" },
    { name: "License", path: "https://www.creative-tim.com/license" },
  ],
};

Footer.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.object),
};

Footer.displayName = "/src/widgets/layout/footer.jsx";

export default Footer;
