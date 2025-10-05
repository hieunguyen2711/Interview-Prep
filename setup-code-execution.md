# Code Execution Setup Guide

This guide will help you set up the code execution environment for your interview prep app.

## Prerequisites

### 1. Python Installation
Make sure Python 3 is installed on your system:

```bash
# Check if Python 3 is installed
python3 --version

# If not installed, install Python 3
# On macOS with Homebrew:
brew install python3

# On Ubuntu/Debian:
sudo apt update
sudo apt install python3

# On Windows:
# Download from https://python.org
```

### 2. Node.js Installation
Make sure Node.js is installed (should already be installed for Next.js):

```bash
# Check if Node.js is installed
node --version
npm --version
```

### 3. TypeScript Compiler
The TypeScript compiler is already included in your devDependencies, but you can verify:

```bash
# Check if TypeScript is available
npx tsc --version
```

## Security Considerations

The code execution API includes several security measures:

1. **Code Validation**: Basic validation to prevent dangerous operations
2. **Timeout Protection**: 10-second timeout for all executions
3. **Sandboxed Execution**: Code runs in temporary directories
4. **Input Sanitization**: Dangerous imports and functions are blocked

### Blocked Operations
The following operations are blocked for security:
- File system access (`os`, `subprocess`, `fs`, `child_process`)
- System imports (`sys`, `process`)
- Code evaluation (`eval`, `exec`)
- File operations (`open`, `file`, `input`)

## Testing the Setup

### 1. Test Python Execution
Create a simple test to verify Python execution works:

```python
def solution(arr):
    return sum(arr)
```

### 2. Test JavaScript Execution
```javascript
function solution(arr) {
    return arr.reduce((sum, num) => sum + num, 0);
}
```

### 3. Test TypeScript Execution
```typescript
function solution(arr: number[]): number {
    return arr.reduce((sum, num) => sum + num, 0);
}
```

## Environment Variables

Make sure your environment variables are set up:

```bash
# .env.local
GEMINI_API_KEY=your_gemini_api_key_here
```

## Deployment Considerations

### For Production Deployment:

1. **Docker Setup**: Consider using Docker containers for code execution
2. **Resource Limits**: Set memory and CPU limits for code execution
3. **Network Isolation**: Run code execution in isolated network environments
4. **Monitoring**: Add logging and monitoring for code execution
5. **Rate Limiting**: Implement rate limiting to prevent abuse

### Alternative: Use External Services

For production, consider using external code execution services:
- **Judge0 API**: Popular code execution API
- **HackerEarth API**: Code execution and compilation service
- **CodeX API**: Code execution service
- **Replit API**: Online IDE with execution capabilities

## Troubleshooting

### Common Issues:

1. **Python not found**: Make sure `python3` is in your PATH
2. **Permission errors**: Ensure the app has write permissions to temp directories
3. **Timeout errors**: Increase timeout if needed for complex algorithms
4. **Memory issues**: Monitor memory usage for large inputs

### Debug Mode:
Set `NODE_ENV=development` to see detailed error messages.

## Performance Optimization

1. **Caching**: Cache compiled code for repeated executions
2. **Pool Management**: Use process pools for better performance
3. **Resource Monitoring**: Monitor CPU and memory usage
4. **Load Balancing**: Distribute execution across multiple servers

## Security Best Practices

1. **Regular Updates**: Keep Python and Node.js updated
2. **Access Control**: Implement proper authentication and authorization
3. **Audit Logging**: Log all code execution attempts
4. **Input Validation**: Validate all inputs before execution
5. **Output Sanitization**: Sanitize outputs before displaying to users
