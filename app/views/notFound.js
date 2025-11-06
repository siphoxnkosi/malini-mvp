export default function notFound() {
  const element = document.createElement('div');
  element.innerHTML = `
    <div class="flex flex-1 justify-center items-center py-10 px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <h1 class="text-4xl font-bold text-primary">404 - Not Found</h1>
        <p class="mt-4 text-lg text-subtle-light">The page you are looking for does not exist.</p>
      </div>
    </div>
  `;
  return element;
}
