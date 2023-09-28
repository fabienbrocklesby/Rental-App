function PageNotFound() {
  return (
    <div id="PageNotFound" className="defaultPageLayout d-flex flex-column align-items-center container pt-5"  style={{ maxWidth: "500px" }}>
      <div  className="container bg-white p-0 rounded shadow-sm" style={{ maxWidth: "500px", backgroundColor: "#f0f0f0" }}>
        <div className="text-center bg-primary py-3 rounded-top">
          <h1 className="text-white">404</h1>
        </div>
        <div className="p-4 my-2 text-center">
          <h1>Page not found ...</h1>
          <h3><a href="/items">Find some cool listings here :)</a></h3>
        </div>
      </div> 
    </div>
  );
}

export default PageNotFound;
